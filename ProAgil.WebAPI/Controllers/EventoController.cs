using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Domain;
using ProAgil.Repository;

namespace ProAgil.WebAPI.Controllers
{
 [Route("api/[Controller]")]
 [ApiController]
 public class EventoController : ControllerBase
 {
  public readonly IProAgilRepository _repo;
  public EventoController(IProAgilRepository repo)
  {
   _repo = repo;
  }

  [HttpGet]
  public async Task<IActionResult> Get()
  {
    try
    {
       var results = await _repo.GetAllEventoAsync(true);

        return Ok (results);
    }
    catch (System.Exception)
    {
        return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");
    }
  }
  [HttpGet("{EvendoId}")]
  public async Task<IActionResult> Get(int EvendoId)
  {
    try
    {
       var results = await _repo.GetEventoAsyncById(EvendoId,true);

        return Ok (results);
    }
    catch (System.Exception)
    {
        return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");
    }
  }
  [HttpGet("getByTema/{tema}")]
  public async Task<IActionResult> Get(string tema)
  {
    try
    {
       var results = await _repo.GetAllEventoAsyncByTema(tema,true);

        return Ok (results);
    }
    catch (System.Exception)
    {
        return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");
    }
  }
  [HttpPost]
  public async Task<IActionResult> Post(Evento model )
  {
    try
    {
        _repo.Add(model);

        if(await _repo.SaveChangeAsync())
        {
           return Created($"/api/evento/{model.Id}", model);
        }
    }
    catch (System.Exception)
    {
        return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");
    }

    return BadRequest();
  }
  [HttpPut("{EventoId}")]
  public async Task<IActionResult> Put(int EventoId,Evento model)
  {
    try
    { 
        var evento = await _repo.GetEventoAsyncById(EventoId,false);
        if(evento == null) return NotFound();

        _repo.Update(model);

        if(await _repo.SaveChangeAsync())
        {
           return Created($"/api/evento/{model.Id}", model);
        }
    }
    catch (System.Exception)
    {
        return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");
    }

    return BadRequest();
  }
  [HttpDelete("{EventoId}")]
  public async Task<IActionResult> Delete(int EventoId)
  {
    try
    { 
        var evento = await _repo.GetEventoAsyncById(EventoId,false);
        if(evento == null) return NotFound();

        _repo.Delete(evento);

        if(await _repo.SaveChangeAsync())
        {
           return Ok();
        }
    }
    catch (System.Exception)
    {
        return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");
    }

    return BadRequest();
  }

 }
}