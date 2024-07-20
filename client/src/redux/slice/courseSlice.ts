import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit'
import agent from '../../actions/agent'
import { Course, CourseParams } from '../../models/course'
import { PaginatedCourse } from '../../models/paginatedCourse'
import { Pagination } from '../../models/pagination'
import { RootState } from '../store/configureStore'

interface CourseState {
  coursesLoaded: boolean
  status: string
  pagination: Pagination | null
  courseParams: CourseParams
}

const coursesAdapter = createEntityAdapter<Course>()

function getAxiosParams(courseParams: CourseParams) {
  const params = new URLSearchParams()
  params.append('pageIndex', courseParams.pageIndex.toString())
  params.append('pageSize', courseParams.pageSize.toString())
  params.append('sort', courseParams.sort)
  if (courseParams.category)
    params.append('categoryId', courseParams.category.toString())
  if (courseParams.search) params.append('search', courseParams.search)
  return params
}

export const getCoursesAsync = createAsyncThunk<
  PaginatedCourse | undefined,
  void,
  { state: RootState }
>('course/getCoursesAsync', async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().course.courseParams)
  try {
    const response = await agent.Courses.list(params)
    const paged = {
      pageIndex: response.pageIndex,
      pageSize: response.pageSize,
      totalCount: response.count,
    }
    thunkAPI.dispatch(setPagination(paged))
    return response
  } catch (err) {
    console.log(err)
  }
})

export const getCourseAsync = createAsyncThunk<
  Course | undefined,
  { courseId: string }
>('course/getCourseAsync', async ({ courseId }, thunkAPI) => {
  try {
    return await agent.Courses.getById(courseId)
  } catch (err) {
    console.log(err)
  }
})

function getParams() {
  return {
    pageIndex: 1,
    pageSize: 8,
    sort: 'title',
  }
}

export const courseSlice = createSlice({
  name: 'course',
  initialState: coursesAdapter.getInitialState<CourseState>({
    coursesLoaded: false,
    status: 'idle',
    courseParams: getParams(),
    pagination: null,
  }),
  reducers: {
    setCourseParams: (state, action) => {
      state.coursesLoaded = false
      state.courseParams = {
        ...state.courseParams,
        ...action.payload,
        pageIndex: 1,
      }
    },
    setPageNumber: (state, action) => {
      state.coursesLoaded = false
      state.courseParams = { ...state.courseParams, ...action.payload }
    },
    setPagination: (state, action) => {
      state.pagination = action.payload
    },
    resetCourseParams: (state) => {
      state.courseParams = getParams()
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCoursesAsync.pending, (state) => {
      state.status = 'pendingCourses'
    })
    builder.addCase(getCoursesAsync.fulfilled, (state, action) => {
      coursesAdapter.setAll(state, action.payload!.data)
      state.status = 'idle'
      state.coursesLoaded = true
    })
    builder.addCase(getCoursesAsync.rejected, (state) => {
      state.status = 'idle'
    })
    builder.addCase(getCourseAsync.pending, (state) => {
      state.status = 'pendingCourse'
    })
    builder.addCase(getCourseAsync.fulfilled, (state, action) => {
      coursesAdapter.upsertOne(state, action.payload!)
      state.status = 'idle'
    })
    builder.addCase(getCourseAsync.rejected, (state, action) => {
      console.log(action.payload)
      state.status = 'idle'
    })
  },
})

export const coursesSelector = coursesAdapter.getSelectors(
  (state: RootState) => state.course,
)

export const {
  setCourseParams,
  setPagination,
  setPageNumber,
  resetCourseParams,
} = courseSlice.actions
