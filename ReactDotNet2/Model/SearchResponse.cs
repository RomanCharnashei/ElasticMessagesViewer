namespace ReactDotNet2.Model
{
    public class SearchResponse
    {
        public IEnumerable<VKMessage> Messages { get; set; }
        public long Total { get; set; }
        public long Skip { get; set; }
        public long Take { get; set; }
    }
}
