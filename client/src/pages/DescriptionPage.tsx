import React, { useEffect } from 'react'
import { Learning, Requirement } from '../models/course'
import { useParams } from 'react-router'
import { Link, useHistory } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../redux/store/configureStore'
import { addBasketItemAsync } from '../redux/slice/basketSlice'
import { coursesSelector, getCourseAsync } from '../redux/slice/courseSlice'

const DescriptionPage = () => {
  const { id } = useParams<{ id: string }>()
  const course = useAppSelector((state) =>
    coursesSelector.selectById(state, id),
  )

  const dispatch = useAppDispatch()
  const history = useHistory();

  const { basket } = useAppSelector((state) => state.basket)

  useEffect(() => {
    if (!course) dispatch(getCourseAsync({ courseId: id }))
  }, [id, dispatch, course])

  const getParsedDate = (strDate: any) => {
    let strSplitDate = String(strDate).split(' ')
    let date: any = new Date(strSplitDate[0])
    // alert(date);
    let dd: any = date.getDate()
    let mm: any = date.getMonth() + 1 //January is 0!

    let yyyy = date.getFullYear()
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }
    date = dd + '/' + mm + '/' + yyyy
    return date.toString()
  }

   const bookNow = (id: string) => {
    if(basket?.items.find((item) => item.courseId === id) === undefined) {
     dispatch(addBasketItemAsync({ courseId: id }));
    }
   
    history.push('/checkout')
  }

  return (
    <div className="description-page">
      <div className="description-page__body">
        <div className="description-page__header">
          <div className="description-page__header__title">{course?.title}</div>
          <div className="description-page__header__details">
            <div className="description-page__header__details__author">
              Created by{' '}
              <span className="description-page__header__details__author--name">
                {course?.instructor}
              </span>
            </div>
            <div className="description-page__header__details__language">
              Language{' '}
              <span className="description-page__header__details__language--name">
                {course?.language}
              </span>
            </div>
            <div className="description-page__header__details__updated">
              Last updated{' '}
              <span className="description-page__header__details__updated--date">
                {getParsedDate(course?.lastUpdated)}
              </span>
            </div>
          </div>
        </div>

        <div className="description-page__info">
          <div className="description-page__info__category">
            Category{' '}
            <span className="description-page__info__category--name">
              {course?.category}
            </span>
          </div>

          <div className="description-page__info__level">
            Level{' '}
            <span className="description-page__info__level--name">
              {course?.level}
            </span>
          </div>

          <div className="description-page__info__enrolled">
            Total Enrolled{' '}
            <span className="description-page__info__enrolled--count">
              {course?.students}
            </span>
          </div>
        </div>
        <div className="description-page__about">
          <div className="description-page__about__title">
            More about Course
          </div>
          <div className="description-page__about__content">
            {course?.subTitle}
          </div>
        </div>
        <div className="description-page__description">
          <div className="description-page__description__title">
            Description
          </div>
          <div className="description-page__description__content">
            {course?.description}
          </div>
        </div>
      </div>
      <div className="description-page__sidebar">
        <div className="description-page__sidebar__box">
          <div className="description-page__sidebar__box__video">
            <img alt="__image" src={course?.image} width="100%" height="100%" />
          </div>
          <div className="description-page__sidebar__box__price">
            {' '}
            <span className="description-page__sidebar__box__price__real">
              {`$${course?.price}`}
            </span>
            <span className="description-page__sidebar__box__price__before">
              {' '}
              $ 100{' '}
            </span>
            <span className="description-page__sidebar__box__price__discount">
              {course && `${Math.floor(100 - course!.price)}% off`}
            </span>
          </div>
          <div className="description-page__sidebar__box__learning">
            <div className="description-page__sidebar__box__learning__title">
              What will you learn?
            </div>
            <div className="description-page__sidebar__box__learning__content">
              <ul className="description-page__sidebar__box__learning__content__list">
                {course?.learnings.map((learning: Learning, index: number) => {
                  return (
                    <li
                      key={index}
                      className="description-page__sidebar__box__learning__content__list__item"
                    >
                      <span className="description-page__sidebar__box__learning__content__list__item__span">
                        &#10003;
                      </span>{' '}
                      {learning.name}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div className="description-page__sidebar__box__button">
            {basket?.items.find((item) => item.courseId === course?.id) !==
            undefined ? (
              <Link
                className="description-page__sidebar__box__button--cart"
                to="/basket"
              >
                Go to cart
              </Link>
            ) : (
              <div
                onClick={() =>
                  dispatch(addBasketItemAsync({ courseId: course!.id }))
                }
                className="description-page__sidebar__box__button--cart"
              >
                Add to cart
              </div>
            )}
            <div onClick={() => bookNow(course!.id)} className="description-page__sidebar__box__button--text">
              Book now
            </div>
          </div>
        </div>
        <div className="description-page__sidebar__body">
          <div className="description-page__sidebar__body__requirements">
            <div className="description-page__sidebar__body__requirements__title">
              Requirements for the course
            </div>
            <div className="description-page__sidebar__body__requirements__content">
              <ul className="description-page__sidebar__body__requirements__content__list">
                {course?.requirements.map(
                  (requirements: Requirement, index: number) => {
                    return (
                      <li
                        key={index}
                        className="description-page__sidebar__body__requirements__content__list__item"
                      >
                        <span className="description-page__sidebar__body__requirements__content__list__item__span">
                          &#10003;
                        </span>{' '}
                        {requirements.name}
                      </li>
                    )
                  },
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DescriptionPage
