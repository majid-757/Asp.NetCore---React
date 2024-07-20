import React, { useEffect, useState } from 'react'
import agent from '../actions/agent'
import { Row } from 'antd'

import { useParams } from 'react-router'
import ShowCourses from '../components/ShowCourses'
import { Course } from '../models/course'
import { Category } from '../models/category'

const CategoryPage = () => {
  const [data, setData] = useState<Category>()
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    agent.Categories.getCategory(parseInt(id)).then((response) => {
      setData(response)
    })
  }, [id])

  return (
    <div className="course">
      <div className="course__header">
        <h1>Pick a course from your favorite category!</h1>
        <h2>{data?.name}</h2>
      </div>
      <Row gutter={[24, 32]}>
        {data?.courses?.length ? (
          data?.courses!.map((course: Course, index: number) => {
            return <ShowCourses key={index} course={course} />
          })
        ) : (
          <h1>No Courses found in this Category!</h1>
        )}
      </Row>
    </div>
  )
}

export default CategoryPage
