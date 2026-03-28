using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eBookStore.Domain.Models.Responces
{
    public class ActionResponce
    {
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }
    }
}