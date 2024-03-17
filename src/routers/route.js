import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Home from "../components/home/Home";
import Publiclayout from "../components/layout/publicLayout/Publiclayout";
import Profile from "../components/profile/Profile";
import Tour from "../components/detail/Tour";
import Searching from "../components/search/Searching";
import Admin from "../components/admin/Admin";
import CreateTour from "../components/tour/CreateTour";
import Forgot from "../components/auth/Forgot";
import ChangePassword from '../components/auth/ChangePassword';
import TableTour from "../components/tour/tableTour";
import EditTour from "../components/tour/EditTour";

export const publicRouter = [
	{
		element: TableTour,
		path: "/tour/mytour",
	},
	{
		element: Home,
		path: "/",
		layout: Publiclayout,
	},
	{
		element: Login,
		path: "/login",
	},
	{
		element: Register,
		path: "/register",
	},
	{
		element: Forgot,
		path: "/forgot",
	},
	{
		element: ChangePassword,
		path: "/change-password/:id/:token",
	},
	{
		element: Profile,
		path: "/:slug/profile",
		layout: Publiclayout,
	},
	{
		element: CreateTour,
		path: "/tour/create"
	},
	{
		element: Tour,
		path: "/tour/:slug",
		layout: Publiclayout,
	},
	{
		element: Searching,
		path: "/tour/search",
		layout: Publiclayout,
	},
	{
		element: Admin,
		path: "/admin/manager/:slug"
	},
	{
		element: EditTour,
		path: "/tour/edit/:id"
	}
];
export const adminRouter = [
	
];
export const userRouter = [

];
