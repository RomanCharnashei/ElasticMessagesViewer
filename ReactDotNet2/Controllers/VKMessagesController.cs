using Microsoft.AspNetCore.Mvc;
using Nest;
using ReactDotNet2.Model;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ReactDotNet2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VKMessagesController : ControllerBase
    {
        private ElasticClient _elasticClient;

        public VKMessagesController(ElasticClient elasticClient)
        {
            _elasticClient = elasticClient;
        }

        // GET: api/<VKMessagesController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VKMessage>>> Get(string? query, int skip = 0, int take = 10)
        {
            var result = await _elasticClient.SearchAsync<VKMessage>(s => s
                .From(skip)
                .Size(take)
                .Query(q => q
                    .MultiMatch(m => m                    
                        .Fields(f => f.Field("attachments.type"))
                        .Query(query)

                    )
                )
            );

            return Ok(
                new SearchResponse
                {
                    Messages = result.Documents,
                    Total = result.Total
                }
            );
        }

        // GET api/<VKMessagesController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<VKMessagesController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<VKMessagesController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<VKMessagesController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
