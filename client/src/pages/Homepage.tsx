import React, { useEffect } from 'react'
import { Card, Col, Radio, Row } from 'antd'
import { Course } from '../models/course'
import ShowCourses from '../components/ShowCourses'
import { Pagination } from 'antd'
import { useAppDispatch, useAppSelector } from '../redux/store/configureStore'
import {
  coursesSelector,
  getCoursesAsync,
  setCourseParams,
  setPageNumber,
} from '../redux/slice/courseSlice'
import { categoriesSelector } from '../redux/slice/categorySlice'
import { Category } from '../models/category'

const sortOptions = [
  { value: 'title', label: 'Alphabetical' },
  { value: 'priceDescending', label: 'Price - High to low' },
  { value: 'priceAscending', label: 'Price - Low to high' },
]

const Homepage = () => {
  const data = useAppSelector(coursesSelector.selectAll)
  const dispatch = useAppDispatch()
  const { coursesLoaded, pagination, courseParams } = useAppSelector(
    (state) => state.course,
  )
  const categories = useAppSelector(categoriesSelector.selectAll)

  const getCategories = () => {
    const catArray: any[] = []
    categories.forEach((category: Category) => {
      catArray.push({ value: category.id, label: category.name })
    })
    return catArray
  }

  useEffect(() => {
    if (!coursesLoaded) dispatch(getCoursesAsync())
  }, [coursesLoaded, dispatch])

  function onChange(pageNumber: number) {
    dispatch(setPageNumber({ pageIndex: pageNumber }))
  }

  return (
    <div className="course">
      <div className="course__header">
        <h1>What to learn Next?</h1>
        <h2>New Courses picked just for you...</h2>
      </div>
      <Row gutter={[24, 32]}>
        <Col span={4}>
          <Card title="Sorting Options">
            <Radio.Group
              options={sortOptions}
              value={courseParams.sort}
              onChange={(e) =>
                dispatch(setCourseParams({ sort: e.target.value }))
              }
            />
          </Card>
          <Card title="Choose Category">
            <Radio.Group
              options={getCategories()}
              value={courseParams.category}
              onChange={(e) => {
                dispatch(setCourseParams({ category: e.target.value }))
              }}
            />
          </Card>
        </Col>
        <Col span={20}>
          <Row gutter={[24, 32]}>
            {data &&
              data.map((course: Course, index: number) => {
                return <ShowCourses key={index} course={course} />
              })}
          </Row>
          <div className="pagination">
            {pagination && (
              <Pagination
                defaultCurrent={pagination?.pageIndex}
                total={pagination?.totalCount}
                onChange={onChange}
                pageSize={pagination?.pageSize}
              />
            )}
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Homepage
