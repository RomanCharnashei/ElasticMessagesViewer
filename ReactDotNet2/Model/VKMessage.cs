namespace ReactDotNet2.Model
{
    public class VKMessage
    {
        public string СontactPersonName { get; set; }
        public string СontactPersonLink { get; set; }
        public string Author { get; set; }
        public string Message { get; set; }
        public IEnumerable<VKAttachment> Attachments { get; set; }
        public DateTime Date { get; set; }
        public string FilePath { get; set; }
    }
}
