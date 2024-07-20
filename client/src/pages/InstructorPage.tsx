import { Button, Card } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Course } from '../models/course';
import { getUnpublishedCourses } from '../redux/slice/userSlice';
import { useAppDispatch, useAppSelector } from '../redux/store/configureStore';

const InstructorPage = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUnpublishedCourses());
  }, [dispatch]);

  const { unpublishedCourses } = useAppSelector((state) => state.user);

  const makeCourse = () => {
    history.push('/instructor/course');
  };

  return (
    <div className="instructor">
      <div className="instructor__left">
        <div className="instructor__left__header">
          {unpublishedCourses.length > 0
            ? 'My Unpublished Courses'
            : 'Create a new Course'}
        </div>
        <div className="instructor__left__courses">
          {unpublishedCourses.map((course: Course, index: number) => {
            return (
              <Link to={`${course.id}/lectures`} key={index}>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={<img alt={course.title} src={course.image} />}
                >
                  <Meta title={course.title} description={course.subTitle} />
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
      <div onClick={makeCourse} className="instructor__right">
        <Button type="primary"> New Course</Button>
      </div>
    </div>
  );
};

export default InstructorPage;