using System;
using System.Collections.Generic;

namespace API.Dto
{
    public class AddSectionDto
    {
        public Guid CourseId { get; set; }
        public string SectionName { get; set; }
        public List<LectureDto> Lectures { get; set; }
    }
}