import {
	state,
	react,
	construct,
	destruct,
	write,
	route,
	view,
	req,
	path,
	page,
	globe,
	D,
	T,
	B,
	V,
	P,
	I,
} from "~/config/shop"
import {SearchIcon, MenuIcon, BellIcon, DownTriangleIcon, CrossIcon} from "~/pieces/icon"
import {db} from '~/config/db'

export default () => {
	var width = state()
	var nav = route()
	var menu_options = ["Home", "TV Shows", "Movies", "Latest", "My List", "Kids"]
	var opt_pick = state(0)
	var see_search = state(false)
	var see_profile_list = state(false)
	var form_data = state({search: ""})
	var search_field
	var menu_on = state(false)
	var profiles = state()

	construct(async () => {
		width(view.width())
		view.put_listen("resize", handler)
		profiles(db.get(`profiles`))
	})

	destruct(() => {
		view.cut_listen("resize", handler)
	})

	var form_submit = async () => {
		get_results()
	}

	var handler = () => width(view.width())

	var get_results = () => {
		form_data().search.trim() !== "" && nav("/search?q=" + form_data().search)
	}

	var set_profile = (v) => {
		var profile = db.set(`profile`, v)
		globe({...globe(), profile})
	}

	return (
		<>
			<D
				style={
					"z_put z-[2] c_grey_2 v4:c_null w_full fit_1 v4:ax_same pt-[.5rem] v4:pt-0 v4:my-[1.25rem] "
				}>
				<B click={() => nav("/")} style={"tc_1 tw_1 ts_3 mr-[1rem] v5:mr-[2rem]"}>
					<P value={"/config/logo.png"} style={` w-[6rem] hide v5:see`} />
					<P value={"/config/logo_small.png"} style={`w-[1.75rem] v5:hide`} />
				</B>
				<D
					style={`${
						!menu_on() && `hide`
					} ay_top v4:ax_same w-[calc(100%)] tc_grey ts_1 mb-[1rem] v4:mb-0`}>
					<D style={`ay_top v4:ax_same gap-[1rem] w-full v4:w-fit`}>
						{menu_options.slice(0, -1).map((v, i) => (
							<B
								click={() => opt_pick(i)}
								style={`hover:tc_white ${opt_pick() === i && `tc_white`}`}>
								{v}
							</B>
						))}
					</D>
					<D style={`ay_top sy_left v4:ax_same v4:sx_mid gap-[1.2rem] z_fit z-[3] `}>
						<D
							css={"transition: width 1s ease-in-out;"}
							style={`${
								!see_search()
									? "ax_right v4:ax_right sx_mid w-[0rem] h-[0rem] border-[0rem] border-white px-[.1rem] c_black"
									: "ax_right v4:ax_right sx_mid w-full v4:w-[14rem] mt-[1rem] v4:mt-[0rem] h-[1.7rem] c_black border-[.1rem] border-white px-[.1rem]"
							} 
								 transition-all ease-in-out duration-[1000ms] `}>
							<B
								click={() => {
									form_submit(form_data().search)
								}}
								style={`w-[1.25rem] h-[1.25rem] ic_white stroke-[2rem]  `}>
								<SearchIcon />
							</B>
							<I
								ref={search_field}
								value={form_data().search}
								input={(e) => {
									form_data({...form_data(), search: e.target.value})
									get_results()
								}}
								holder={"Title, people, genres"}
								style={`c_black tc_white ml-[.3rem] w-full`}
							/>
							{form_data().search.trim() !== "" && (
								<B
									click={() => form_data({...form_data(), search: ""})}
									style={`ml-[.2rem] mr-[.3rem] w-[.75rem] h-[.75rem] stroke-white stroke-[1rem]`}>
									<CrossIcon />
								</B>
							)}
						</D>
						{!see_search() && (
							<B
								click={() => {
									see_search(true)
									search_field?.focus()
								}}
								style={`w-[1.25rem] h-[1.25rem] ic_white stroke-[2rem] `}>
								<SearchIcon />
							</B>
						)}
						<B
							click={() => opt_pick(-1)}
							style={`hover:tc_white ${opt_pick() === -1 && `tc_white `} mx_auto`}>
							Kids
						</B>
						<B
							style={`w-[1.5rem] h-[1.5rem] stroke-[.5rem] stroke-white fill-white ax_mid mx_auto `}>
							<BellIcon />
						</B>
						<B click={() => see_profile_list(!see_profile_list())} style={`ax_right mx_auto  `}>
							<P
								value={globe()?.profile?.pic_link}
								style={`w-[1.5rem] h-[1.5rem] mr-[.6rem] rounded-[.2rem]`}
							/>
							<D style={`w-[.8rem] h-[.4rem] ic_white ax_right mt-[.5rem]`}>
								<DownTriangleIcon />
							</D>
						</B>
						{see_profile_list() === true && (
							<D
								style={`v4:z_put z-[3] v4:c_black v4:opacity-[.8] w-full v4:w-[10rem] ay_top sy_mid v4:sy_right h-fit v4:top-[2.5rem] right-0 px-[.5rem] py-[1rem] `}>
								<D style="ay_mid gap-y-[.5rem]">
									{profiles()
										.filter((v) => v?.id !== globe()?.profile?.id)
										.map((v) => (
											<D style="ax_right sx_mid" click={() => set_profile(v)}>
												<P
													value={v?.pic_link}
													style={`w-[1.5rem] h-[1.5rem] mr-[.6rem] rounded-[.2rem]`}
												/>
												<T>{v?.id}</T>
											</D>
										))}
								</D>
								<T style="py-[1rem]">Manage Profiles</T>
								<T style="pb-[.5rem]">Account</T>
								<T>Help Center</T>
								<T style="pt-[1rem]">Sign out of Netflix</T>
							</D>
						)}
					</D>
				</D>
			</D>
			<B
				click={() => menu_on(!menu_on())}
				style={`z_put z-[2] right-[1rem] top-[.5rem] see v4:hide w-[1.75rem] h-[1.75rem] hover:ibc_grey`}>
				<MenuIcon />
			</B>
		</>
	)
}
