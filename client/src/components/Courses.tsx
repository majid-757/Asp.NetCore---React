import React, { useState, useLayoutEffect, useEffect } from 'react'
import { Card, Col, Row } from 'antd'
import * as FaIcons from 'react-icons/fa'
import agent from '../actions/agent'
import { Course } from '../models/course'
import { PaginatedCourse } from '../models/paginatedCourse'

const Courses = () => {
  const [data, setData] = useState<PaginatedCourse>()
  const [spanVal, setSpanVal] = useState<number>()
  const [loading, setLoading] = useState(false)

  const checkWidth = (): void => {
    if (window.innerWidth > 1024) {
      setSpanVal(6)
    } else if (window.innerWidth < 1024 && window.innerWidth > 768) {
      setSpanVal(8)
    } else {
      setSpanVal(12)
    }
  }

  useLayoutEffect(() => {
    window.addEventListener('resize', checkWidth)
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  useEffect(() => {
    agent.Courses.list().then((response) => {
      setLoading(true)
      setData(response)
      setLoading(false)
    })
    checkWidth()
  }, [])

  const showStars = (rating: number): [] => {
    const options: any = []
    for (let i = 1; i < rating; i++) {
      options.push(<FaIcons.FaStar key={i} />)
      if (rating - i < 1 && rating - i > 0.3) {
        options.push(<FaIcons.FaStarHalf key={i + 1} />)
      }
    }
    return options
  }

  return (
    <div className="course">
      <div className="course__header">
        <h1>What to Learn Next?</h1>
        <h2>New Courses picked just for you...</h2>
      </div>
      <Row gutter={[24, 32]}>
        {data &&
          data.data.map((course: Course, index: number) => {
            return (
              <Col key={index.toString()} className="gutter-row" span={spanVal}>
                <Card
                  hoverable
                  loading={loading}
                  cover={
                    <img width="100%" alt="course-cover" src={course.image} />
                  }
                >
                  <div className="course__title">{course.title} </div>
                  <div className="course__instructor">{course.instructor} </div>
                  <div className="course__rating">
                    {course.rating}
                    <span> {showStars(course.rating)}</span>
                  </div>
                  <div className="course__price">{`$ ${course.price}`}</div>
                </Card>
              </Col>
            )
          })}
      </Row>
    </div>
  )
}

export default Courses
