using System.Globalization;
using System.Text.Json;
using System.Text.RegularExpressions;
using FinanceTracker.Domain.Models.ReceiptScan;

namespace FinanceTracker.BusinessLayer.Core
{
    public class ReceiptScanActions
    {
        private static readonly string[] AllowedCategories =
        {
            "food",
            "transport",
            "shopping",
            "entertainment",
            "health",
            "education",
            "travel",
            "bills",
            "other"
        };

        public ReceiptScanActions()
        {
        }

        internal ReceiptScanResultDto ScanReceiptActionExecution(ReceiptScanRequestDto request)
        {
            var html = FetchUrlHtml(request.QrUrl);
            var structuredResult = TryExtractStructuredReceiptResult(html, request.QrUrl);
            if (structuredResult != null)
            {
                return NormalizeResult(structuredResult, request.QrUrl);
            }

            var text = NormalizeHtmlToText(html);
            var directResult = TryExtractReceiptDetails(text, request.QrUrl);
            if (directResult != null)
            {
                return NormalizeResult(directResult, request.QrUrl);
            }

            return NormalizeResult(new ReceiptScanResultDto
            {
                Amount = ParseAmountFromUrl(request.QrUrl),
                Date = NormalizeDate(null, request.QrUrl),
                PaymentMethod = "qr_scan",
            }, request.QrUrl);
        }

        private static ReceiptScanResultDto NormalizeResult(ReceiptScanResultDto result, string qrUrl)
        {
            return new ReceiptScanResultDto
            {
                StoreName = string.IsNullOrWhiteSpace(result.StoreName) ? null : result.StoreName.Trim(),
                Amount = result.Amount ?? ParseAmountFromUrl(qrUrl),
                Category = NormalizeCategory(result.Category),
                Date = NormalizeDate(result.Date, qrUrl),
                PaymentMethod = NormalizePaymentMethod(result.PaymentMethod),
                Notes = string.IsNullOrWhiteSpace(result.Notes) ? null : result.Notes.Trim(),
            };
        }

        private static string NormalizePaymentMethod(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return "qr_scan";
            }

            var normalized = value.Trim().ToLowerInvariant();
            return normalized switch
            {
                "cash" => "cash",
                "card" => "card",
                "bank_transfer" => "bank_transfer",
                "qr_scan" => "qr_scan",
                _ => "qr_scan",
            };
        }

        private static string NormalizeCategory(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return "other";
            }

            var normalized = value.Trim().ToLowerInvariant();
            return AllowedCategories.Contains(normalized) ? normalized : "other";
        }

        private static string? NormalizeDate(string? value, string qrUrl)
        {
            if (!string.IsNullOrWhiteSpace(value))
            {
                var match = Regex.Match(value, @"^(\d{4}-\d{2}-\d{2})");
                if (match.Success)
                {
                    return match.Groups[1].Value;
                }

                if (DateTime.TryParse(value, CultureInfo.InvariantCulture, DateTimeStyles.AssumeLocal, out var parsedDate))
                {
                    return parsedDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
                }
            }

            var urlMatch = Regex.Match(qrUrl ?? string.Empty, @"/(\d{4}-\d{2}-\d{2})(?:/|$)");
            if (urlMatch.Success)
            {
                return urlMatch.Groups[1].Value;
            }

            return null;
        }

        private static decimal? ParseAmountFromUrl(string qrUrl)
        {
            var match = Regex.Match(qrUrl ?? string.Empty, @"/(\d+(?:[\.,]\d{1,2})?)/(?:\d+|\d{4}-\d{2}-\d{2})(?:/|$)");
            if (!match.Success)
            {
                return null;
            }

            var rawAmount = match.Groups[1].Value.Replace(',', '.');
            return decimal.TryParse(rawAmount, NumberStyles.Any, CultureInfo.InvariantCulture, out var parsed)
                ? parsed
                : null;
        }

        private static ReceiptScanResultDto? TryExtractReceiptDetails(string receiptText, string qrUrl)
        {
            if (string.IsNullOrWhiteSpace(receiptText))
            {
                return null;
            }

            var lines = receiptText
                .Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(line => Regex.Replace(line, @"\s+", " ").Trim())
                .Where(line => !string.IsNullOrWhiteSpace(line))
                .ToArray();

            var storeName = ExtractStoreName(lines);
            var amount = ExtractAmount(lines) ?? ParseAmountFromUrl(qrUrl);
            var date = ExtractDate(lines) ?? NormalizeDate(null, qrUrl);
            var itemLine = ExtractItemLine(lines);
            var paymentMethod = NormalizePaymentMethod(lines);
            var category = InferCategory(itemLine ?? storeName ?? string.Empty);

            if (string.IsNullOrWhiteSpace(storeName) && amount == null && string.IsNullOrWhiteSpace(date) && string.IsNullOrWhiteSpace(itemLine))
            {
                return null;
            }

            return new ReceiptScanResultDto
            {
                StoreName = storeName,
                Amount = amount,
                Category = category,
                Date = date,
                PaymentMethod = paymentMethod,
                Notes = itemLine,
            };
        }

        private static string? ExtractStoreName(string[] lines)
        {
            var fiscalIndex = Array.FindIndex(lines, line => line.Contains("COD FISCAL", StringComparison.OrdinalIgnoreCase));
            if (fiscalIndex > 0)
            {
                for (var index = fiscalIndex - 1; index >= 0; index--)
                {
                    var candidate = lines[index].Trim();
                    if (!string.IsNullOrWhiteSpace(candidate) && !candidate.StartsWith("NUMARUL", StringComparison.OrdinalIgnoreCase))
                    {
                        return candidate;
                    }
                }
            }

            var registerIndex = Array.FindIndex(lines, line => line.Contains("NUMARUL DE ÎNREGISTRARE", StringComparison.OrdinalIgnoreCase));
            if (registerIndex > 0)
            {
                for (var index = registerIndex - 1; index >= 0; index--)
                {
                    var candidate = lines[index].Trim();
                    if (!string.IsNullOrWhiteSpace(candidate) && !candidate.StartsWith("COD FISCAL", StringComparison.OrdinalIgnoreCase))
                    {
                        return candidate;
                    }
                }
            }

            return null;
        }

        private static decimal? ExtractAmount(string[] lines)
        {
            foreach (var line in lines)
            {
                if (!line.Contains("TOTAL", StringComparison.OrdinalIgnoreCase) &&
                    !line.Contains("Suma totală a bonului", StringComparison.OrdinalIgnoreCase) &&
                    !line.Contains("SUMA TOTALA", StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                var match = Regex.Match(line, @"(\d+(?:[\.,]\d{1,2})?)");
                if (match.Success && decimal.TryParse(match.Groups[1].Value.Replace(',', '.'), NumberStyles.Any, CultureInfo.InvariantCulture, out var amount))
                {
                    return amount;
                }
            }

            return null;
        }

        private static string? ExtractDate(string[] lines)
        {
            foreach (var line in lines)
            {
                var match = Regex.Match(line, @"(?:DATA|DATA EMITERII BONULUI)\s*(\d{1,2})[\./-](\d{1,2})[\./-](\d{4})", RegexOptions.IgnoreCase);
                if (match.Success)
                {
                    var day = match.Groups[1].Value.PadLeft(2, '0');
                    var month = match.Groups[2].Value.PadLeft(2, '0');
                    var year = match.Groups[3].Value;
                    return $"{year}-{month}-{day}";
                }
            }

            return null;
        }

        private static string? ExtractItemLine(string[] lines)
        {
            var totalIndex = Array.FindIndex(lines, line => line.Contains("TOTAL", StringComparison.OrdinalIgnoreCase));
            var searchLines = totalIndex > 0 ? lines[..totalIndex] : lines;

            foreach (var line in searchLines)
            {
                if (line.Contains("TOTAL", StringComparison.OrdinalIgnoreCase) ||
                    line.Contains("TVA", StringComparison.OrdinalIgnoreCase) ||
                    line.Contains("NUMERAR", StringComparison.OrdinalIgnoreCase) ||
                    line.Contains("DATA", StringComparison.OrdinalIgnoreCase) ||
                    line.Contains("COD FISCAL", StringComparison.OrdinalIgnoreCase) ||
                    line.Contains("NUMARUL DE ÎNREGISTRARE", StringComparison.OrdinalIgnoreCase) ||
                    line.Contains("VERIFICAREA BONULUI", StringComparison.OrdinalIgnoreCase) ||
                    line.Contains("ELECTRONIC SERVICE", StringComparison.OrdinalIgnoreCase) ||
                    line.Contains("CONSUMATORUL FINAL", StringComparison.OrdinalIgnoreCase) ||
                    line.Contains("HELP", StringComparison.OrdinalIgnoreCase) ||
                    line.Contains("INFO", StringComparison.OrdinalIgnoreCase) ||
                    line.Contains("SEARCH", StringComparison.OrdinalIgnoreCase) ||
                    line.Contains("AJUTOR", StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                if (!Regex.IsMatch(line, @"\bx\b|\d+(?:[\.,]\d+)?\s*x\s*\d", RegexOptions.IgnoreCase))
                {
                    continue;
                }

                var match = Regex.Match(line, @"^(?<item>[A-Za-zĂÂÎȘȚăâîșț .,'/-]+?)\s*\d", RegexOptions.IgnoreCase);
                if (match.Success)
                {
                    var item = match.Groups["item"].Value.Trim();
                    if (item.Length >= 3)
                    {
                        return item;
                    }
                }
            }

            return null;
        }

        private static string NormalizePaymentMethod(string[] lines)
        {
            var joined = string.Join(' ', lines).ToUpperInvariant();
            if (joined.Contains("NUMERAR")) return "cash";
            if (joined.Contains("CARD")) return "card";
            if (joined.Contains("TRANSFER")) return "bank_transfer";
            return "qr_scan";
        }

        private static string InferCategory(string text)
        {
            var normalized = text.ToLowerInvariant();

            if (ContainsAny(normalized, "pretzel", "cascaval", "pizza", "burger", "sandwich", "cafe", "cafenea", "restaurant", "market", "bakery", "patiserie", "cofetarie", "paine", "lapte", "carne", "fructe", "legume", "food", "aliment", "grocery"))
                return "food";
            if (ContainsAny(normalized, "taxi", "uber", "bolt", "bus", "autobuz", "tramvai", "metro", "metrou", "train", "tren", "transport", "fuel", "benzina", "motorina", "car", "bilet"))
                return "transport";
            if (ContainsAny(normalized, "pharmacy", "farmacie", "medicament", "health", "medical", "clinic", "spital", "doctor", "sanatate"))
                return "health";
            if (ContainsAny(normalized, "book", "manual", "school", "scoala", "education", "university", "universitate", "course", "curs", "taxa"))
                return "education";
            if (ContainsAny(normalized, "hotel", "flight", "zbor", "avion", "travel", "trip", "airbnb", "booking"))
                return "travel";
            if (ContainsAny(normalized, "bill", "factura", "utility", "utilitati", "electric", "curent", "water", "apa", "internet", "gas", "gaz", "telefon", "energie"))
                return "bills";
            if (ContainsAny(normalized, "cinema", "movie", "theater", "teatru", "concert", "music", "festival", "game", "gaming", "netflix", "spotify", "entertainment"))
                return "entertainment";
            if (ContainsAny(normalized, "shop", "store", "magazin", "mall", "electronics", "electronice", "clothes", "haine", "incaltaminte", "gadget"))
                return "shopping";

            return "other";
        }

        private static bool ContainsAny(string text, params string[] keywords)
        {
            return keywords.Any(keyword => text.Contains(keyword, StringComparison.OrdinalIgnoreCase));
        }

        private static string FetchUrlHtml(string url)
        {
            if (string.IsNullOrWhiteSpace(url) || (!url.StartsWith("http://") && !url.StartsWith("https://")))
            {
                return string.Empty;
            }

            try
            {
                using var handler = new HttpClientHandler
                {
                    AllowAutoRedirect = true,
                    AutomaticDecompression = System.Net.DecompressionMethods.GZip
                        | System.Net.DecompressionMethods.Deflate
                        | System.Net.DecompressionMethods.Brotli
                };
                using var client = new HttpClient(handler);
                client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
                client.DefaultRequestHeaders.Add("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
                client.DefaultRequestHeaders.Add("Accept-Language", "en-US,en;q=0.9,ro;q=0.8");
                client.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
                client.Timeout = TimeSpan.FromSeconds(6);

                var fetchUrl = ResolveVerifierUrl(url);
                var html = client.GetStringAsync(fetchUrl).Result;

                if (LooksLikeBlockedPage(html))
                {
                    return string.Empty;
                }

                return html;
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }

        private static bool LooksLikeBlockedPage(string html)
        {
            var text = html.ToLowerInvariant();
            return text.Contains("sorry, you have been blocked")
                   || text.Contains("attention required")
                   || text.Contains("cf-error-details");
        }

        private static string ResolveVerifierUrl(string url)
        {
            if (url.Contains("/receipt-verifier/", StringComparison.OrdinalIgnoreCase))
            {
                return url;
            }

            var match = Regex.Match(url, @"^https?://(?:sift-mev\.)?sfs\.md/receipt/(?<path>.+)$", RegexOptions.IgnoreCase);
            if (match.Success)
            {
                return $"https://mev.sfs.md/receipt-verifier/{match.Groups["path"].Value}";
            }

            return url;
        }

        private static string NormalizeHtmlToText(string html)
        {
            if (string.IsNullOrWhiteSpace(html))
            {
                return string.Empty;
            }

            var withBreaks = Regex.Replace(html, @"<(?:br|/p|/div|/li|/h[1-6]|/tr|/section|/article|/header|/footer|/table)\b[^>]*>", "\n", RegexOptions.IgnoreCase);
            withBreaks = Regex.Replace(withBreaks, @"<(?:p|div|li|h[1-6]|tr|section|article|header|footer|table)\b[^>]*>", "\n", RegexOptions.IgnoreCase);
            var noScripts = Regex.Replace(withBreaks, @"<script[^>]*>[\s\S]*?</script>", " ", RegexOptions.IgnoreCase);
            var noStyles = Regex.Replace(noScripts, @"<style[^>]*>[\s\S]*?</style>", " ", RegexOptions.IgnoreCase);
            var stripped = Regex.Replace(noStyles, "<.*?>", " ");
            var normalizedLines = stripped
                .Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(line => Regex.Replace(line, @"\s+", " ").Trim())
                .Where(line => !string.IsNullOrWhiteSpace(line));

            return string.Join('\n', normalizedLines);
        }

        private static ReceiptScanResultDto? TryExtractStructuredReceiptResult(string html, string qrUrl)
        {
            if (string.IsNullOrWhiteSpace(html))
            {
                return null;
            }

            var decodedHtml = System.Net.WebUtility.HtmlDecode(html);

            if (!TryExtractJsonArray(decodedHtml, "\"receipt\"", out var receiptArrayText))
            {
                return null;
            }

            string? merchant = null;
            string? item = null;
            decimal? amount = null;
            string? paymentMethod = null;

            try
            {
                using var receiptDoc = JsonDocument.Parse(receiptArrayText);
                var receiptArray = receiptDoc.RootElement;

                foreach (var element in receiptArray.EnumerateArray())
                {
                    if (merchant == null && element.ValueKind == JsonValueKind.String)
                    {
                        var candidate = element.GetString()?.Trim();
                        if (!string.IsNullOrWhiteSpace(candidate))
                        {
                            merchant = candidate;
                        }
                        continue;
                    }

                    if (element.ValueKind != JsonValueKind.Array || element.GetArrayLength() == 0)
                    {
                        continue;
                    }

                    var label = element[0].GetString()?.Trim();
                    var value = element.GetArrayLength() > 1 ? element[1].GetString()?.Trim() : null;
                    if (string.IsNullOrWhiteSpace(label))
                    {
                        continue;
                    }

                    if (label.StartsWith("TOTAL", StringComparison.OrdinalIgnoreCase) && amount == null)
                    {
                        amount = TryParseAmount(value) ?? TryParseAmount(label);
                    }

                    if (label.StartsWith("NUMERAR", StringComparison.OrdinalIgnoreCase))
                    {
                        paymentMethod = "cash";
                    }
                    else if (label.StartsWith("CARD", StringComparison.OrdinalIgnoreCase))
                    {
                        paymentMethod = "card";
                    }
                    else if (label.Contains("TRANSFER", StringComparison.OrdinalIgnoreCase))
                    {
                        paymentMethod = "bank_transfer";
                    }

                    if (item == null && !IsReceiptMetaLabel(label))
                    {
                        item = label;
                    }
                }
            }
            catch
            {
                return null;
            }

            var amountText = TryExtractJsonString(decodedHtml, "receiptAmount");
            amount ??= TryParseAmount(amountText);

            var dateText = TryExtractJsonString(decodedHtml, "receiptDate");
            var date = TryNormalizeDate(dateText) ?? NormalizeDate(null, qrUrl);

            paymentMethod ??= decodedHtml.Contains("NUMERAR", StringComparison.OrdinalIgnoreCase)
                ? "cash"
                : decodedHtml.Contains("CARD", StringComparison.OrdinalIgnoreCase)
                    ? "card"
                    : "qr_scan";

            if (merchant == null && amount == null && date == null && item == null)
            {
                return null;
            }

            var category = InferCategory(item ?? merchant ?? string.Empty);

            return new ReceiptScanResultDto
            {
                StoreName = merchant,
                Amount = amount,
                Date = date,
                Notes = item,
                Category = category,
                PaymentMethod = paymentMethod,
            };
        }

        private static bool TryExtractJsonArray(string text, string key, out string arrayText)
        {
            arrayText = string.Empty;
            var keyIndex = text.IndexOf(key, StringComparison.OrdinalIgnoreCase);
            if (keyIndex < 0)
            {
                return false;
            }

            var colonIndex = text.IndexOf(':', keyIndex);
            if (colonIndex < 0)
            {
                return false;
            }

            var startIndex = text.IndexOf('[', colonIndex);
            if (startIndex < 0)
            {
                return false;
            }

            var depth = 0;
            var inString = false;
            var escape = false;

            for (var i = startIndex; i < text.Length; i++)
            {
                var ch = text[i];

                if (escape)
                {
                    escape = false;
                    continue;
                }

                if (ch == '\\' && inString)
                {
                    escape = true;
                    continue;
                }

                if (ch == '"')
                {
                    inString = !inString;
                    continue;
                }

                if (inString)
                {
                    continue;
                }

                if (ch == '[')
                {
                    depth++;
                }
                else if (ch == ']')
                {
                    depth--;
                    if (depth == 0)
                    {
                        arrayText = text.Substring(startIndex, i - startIndex + 1);
                        return true;
                    }
                }
            }

            return false;
        }

        private static string? TryExtractJsonString(string text, string key)
        {
            var match = Regex.Match(text, $"\"{Regex.Escape(key)}\"\\s*:\\s*\"(?<value>[^\"]+)\"", RegexOptions.IgnoreCase);
            return match.Success ? match.Groups["value"].Value.Trim() : null;
        }

        private static string? TryNormalizeDate(string? rawDate)
        {
            if (string.IsNullOrWhiteSpace(rawDate))
            {
                return null;
            }

            var match = Regex.Match(rawDate, @"(\d{1,2})[\./-](\d{1,2})[\./-](\d{4})");
            if (!match.Success)
            {
                return null;
            }

            var day = match.Groups[1].Value.PadLeft(2, '0');
            var month = match.Groups[2].Value.PadLeft(2, '0');
            var year = match.Groups[3].Value;
            return $"{year}-{month}-{day}";
        }

        private static decimal? TryParseAmount(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return null;
            }

            var cleaned = value.Replace(',', '.');
            return decimal.TryParse(cleaned, NumberStyles.Any, CultureInfo.InvariantCulture, out var parsed)
                ? parsed
                : null;
        }

        private static bool IsReceiptMetaLabel(string label)
        {
            return label.StartsWith("TOTAL", StringComparison.OrdinalIgnoreCase)
                   || label.StartsWith("TVA", StringComparison.OrdinalIgnoreCase)
                   || label.StartsWith("NUMERAR", StringComparison.OrdinalIgnoreCase)
                   || label.StartsWith("BON FISCAL", StringComparison.OrdinalIgnoreCase)
                   || label.StartsWith("NUMARUL", StringComparison.OrdinalIgnoreCase)
                   || label.StartsWith("COD FISCAL", StringComparison.OrdinalIgnoreCase)
                   || label.StartsWith("DATA", StringComparison.OrdinalIgnoreCase);
        }

    }
}
