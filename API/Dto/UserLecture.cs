using System.Collections.Generic;

namespace API.Dto
{
    public class UserLectureDto
    {
        public string CourseName { get; set; }

        public List<SectionDto> Sections { get; set; }

        public int CurrentLecture { get; set; }
    }
}