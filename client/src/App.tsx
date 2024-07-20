import { Route, Switch } from 'react-router-dom'
import 'antd/dist/antd.css'
import './sass/main.scss'
import DetailPage from './pages/DetailPage'
import Homepage from './pages/Homepage'
import LoginPage from './pages/LoginPage'
import Navigation from './components/Navigation'
import Categories from './components/Categories'
import CategoryPage from './pages/CategoryPage'
import DescriptionPage from './pages/DescriptionPage'
import BasketPage from './pages/BasketPage'
import { useEffect, useState, useCallback } from 'react'
import { useAppDispatch } from './redux/store/configureStore'
import { fetchBasketAsync } from './redux/slice/basketSlice'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRout'
import CheckoutPage from './pages/CheckoutPage'
import { fetchCurrentUser } from './redux/slice/userSlice'
import Loading from './components/Loading'
import CoursePage from './pages/CoursePage'
import InstructorPage from './pages/InstructorPage'
import CreateCourse from './pages/CreateCourse'
import { getCategoriesAsync } from './redux/slice/categorySlice'
import SectionPage from './pages/SectionPage'

function App() {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(true)

  const appInit = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser())
      await dispatch(fetchBasketAsync())
      await dispatch(getCategoriesAsync())
    } catch (error) {
      console.log(error)
    }
  }, [dispatch])

  useEffect(() => {
    appInit().then(() => setLoading(false))
  }, [appInit])

  if (loading) return <Loading />

  return (
    <>
      <Navigation />
      <Route exact path="/" component={Categories} />
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/course/:id" component={DescriptionPage} />
        <PrivateRoute exact path="/profile" component={Dashboard} />
        <Route exact path="/category/:id" component={CategoryPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/detail" component={DetailPage} />
        <Route exact path="/basket" component={BasketPage} />
        <PrivateRoute
          exact
          path="/learn/:course/:lecture"
          component={CoursePage}
        />
        <PrivateRoute exact path="/checkout" component={CheckoutPage} />
        <PrivateRoute exact path="/instructor" component={InstructorPage} />
        <PrivateRoute
          exact
          path="/instructor/course"
          component={CreateCourse}
        />
        <PrivateRoute
          exact
          path="/:course/lectures"
          component={SectionPage}
        />
      </Switch>
    </>
  )
}

export default App
