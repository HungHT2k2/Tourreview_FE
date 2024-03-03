import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Home from "../components/home/Home";
import Publiclayout from "../components/layout/publicLayout/Publiclayout";
import Profile from "../components/profile/Profile";
import Recipe from "../components/detail/Recipe";
import Searching from "../components/search/Searching";
import Admin from "../components/admin/Admin";
import CreateRecipe from "../components/recipe/CreateRecipe";
import Forgot from "../components/auth/Forgot";
import ChangePassword from '../components/auth/ChangePassword';
import TableRecipe from "../components/recipe/tableRecipe";
import EditRecipe from "../components/recipe/EditRecipe";

export const publicRouter = [
	{
		element: TableRecipe,
		path: "/recipe/myrecipe",
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
		element: CreateRecipe,
		path: "/recipe/create"
	},
	{
		element: Recipe,
		path: "/recipe/:slug",
		layout: Publiclayout,
	},
	{
		element: Searching,
		path: "/recipe/search",
		layout: Publiclayout,
	},
	{
		element: Admin,
		path: "/admin/manager/:slug"
	},
	{
		element: EditRecipe,
		path: "/recipe/edit/:id"
	}
];
export const adminRouter = [
	
];
export const userRouter = [

];
