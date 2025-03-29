using Microsoft.EntityFrameworkCore;

namespace tutorial.Models
{
    [Keyless]
    public class LINDA_TBL_APP_USUARIOS
    {
        public required string Usuario { get; set; }
        public required int Codigo { get; set; }
    }
}
