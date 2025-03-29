using api.Models;
using api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using tutorial.Models;

namespace api.Controllers
{
    [Route("api/Recibos")]
    [ApiController]
    public class RecibosController : ControllerBase
    {
        private readonly List<string> _allowedUsers = new()
    {
        @"M3LV1N\\test",
        @"DOMAIN\\user2"
    };

        [HttpGet("access")]
        public IActionResult CheckUserAccess()
        {
            try
    {
        // Get the authenticated user's identity from the HTTP context
        var identity = HttpContext.User.Identity;
        
        if (identity == null || !identity.IsAuthenticated)
        {
            return Unauthorized("No authenticated user found");
        }

        return Ok(new
        {
            username = identity.Name,
            authenticationType = identity.AuthenticationType,
            isAuthenticated = identity.IsAuthenticated
        });
    }
    catch (Exception ex)
    {
        return BadRequest($"Error con el usuario: {ex.Message}");
        }

        }
        private readonly ApplicationDBContext context;

        public RecibosController(ApplicationDBContext context)
        {
            this.context = context;
        }



        // Método que llama al stored procedure con un parámetro
        [HttpGet]
        public async Task<ActionResult<List<Recibos>>> RecibosEmpleado([FromQuery] string codEmpleado)
        {

            Console.WriteLine($"Valor recibido en codEmpleado: {codEmpleado}");
            try
            {
                var ultRecibo = await context.Recibos
                                           .FromSqlInterpolated($"EXEC UltimoReciboEmpleado @cod_empleado = {codEmpleado}")
                                           .ToListAsync();

                if (ultRecibo == null || ultRecibo.Count == 0)
                {
                    return NotFound(new { Message = $"No se encontraron recibos para el empleado con código {codEmpleado}" });
                }

                return ultRecibo;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error[RecibosEmpleado]: {ex}");
                return StatusCode(500, new { Message = "Error al ejecutar el procedimiento almacenado1", Error = ex.Message });
            }
        }
        [HttpGet("ultimos")]
        public async Task<ActionResult<List<RecibosRecientesDTO>>> ReciboRecientesEmpleado([FromQuery] string codEmpleado)
        {
            try
            {
                var recibosRecientes = await context.RecibosRecientesDTO
                                            .FromSqlInterpolated($"EXEC ReciboRecientesEmpleado @cod_empleado = {codEmpleado}")
                                            .ToListAsync();
                if (recibosRecientes == null || recibosRecientes.Count == 0)
                {
                    return NotFound(new { Message = $"No se encontraron recibos para el empleado {codEmpleado}" });
                }
                return recibosRecientes;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error[RecibosRecientesEmpleado]: {ex}");
                return StatusCode(500, new { Message = "Error al ejecutar el procedimiento almacenado", Error = ex.Message });
            }
        }
        [HttpGet("mostrar-ultimos")]
        public async Task<ActionResult<List<Recibos>>> MostrarReciboRecienteEmpleado([FromQuery] string codEmpleado, DateOnly fechaPago)
        {
            try
            {
                var recibos = await context.Recibos
                                            .FromSqlInterpolated($"EXEC MostrarReciboRecienteEmpleado @cod_empleado = {codEmpleado}, @fechaPago = {fechaPago}")
                                            .ToListAsync();
                if (recibos == null || recibos.Count == 0)
                {
                    return NotFound(new { Message = $"No se encontraron recibos para el empleado {codEmpleado} con fecha {fechaPago}" });
                }
                return recibos;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error[MostrarReciboRecientesEmpleado]: {ex}");
                return StatusCode(500, new { Message = "Error al ejecutar el procedimiento almacenado3", Error = ex.Message });
            }
        }

    }
}



