namespace Entity
{
    public class Lecture
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Url { get; set; }

        // navigation properties

        public int SectionId { get; set; }

        public Section Section { get; set; }
    }
}