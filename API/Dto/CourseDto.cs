using System;
using System.Collections.Generic;
using Entity;

namespace API.Dto
{
    public class CourseDto
    {
        public Guid Id { get; set; }

        public string Title { get; set; }

        public string Language { get; set; }

        public string Level { get; set; }

        public string SubTitle { get; set; }

        public int Students { get; set; }

        public string Description { get; set; }

        public float Price { get; set; }

        public string Instructor { get; set; }

        public string Image { get; set; }

        public string Category { get; set; }

        public decimal Rating { get; set; }

        public ICollection<RequirementDto> Requirements { get; set; }

        public ICollection<LearningDto> Learnings { get; set; }
    }
}
