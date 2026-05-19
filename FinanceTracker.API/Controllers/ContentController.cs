using FinanceTracker.BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.API.Controllers
{
    [Authorize]
    [Route("api/content")]
    [ApiController]
    public class ContentController : ControllerBase
    {
        private readonly IAdminAction _adminAction;

        public ContentController()
        {
            var bl = new BusinessLayer.BusinessLogic();
            _adminAction = bl.AdminAction();
        }

        [HttpGet]
        public IActionResult GetContent()
        {
            var content = _adminAction.GetAdminContentAction();
            return Ok(content);
        }
    }
}
