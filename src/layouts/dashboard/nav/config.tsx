// component
import SvgColor from "../../../components/svg-color";

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: "dashboard",
    path: "/dashboard",
    icon: icon("ic_dashboard"),
    isAdmin: true,
    isCandidate: false,
  },
  {
    title: "assessments",
    path: "/assessments",
    icon: icon("ic_assessment"),
    isAdmin: true,
    isCandidate: false,
  },
  {
    title: "candidates",
    path: "/candidates",
    icon: icon("ic_candidate"),
    isAdmin: true,
    isCandidate: false,
  },
  {
    title: "candidates request",
    path: "/candidates-request",
    icon: icon("ic_candidate"),
    isAdmin: true,
    isCandidate: false,
  },
  {
    title: "Staffs",
    path: "/staffs",
    icon: icon("ic_staff"),
    isAdmin: true,
    isCandidate: false,
  },
  {
    title: "Results",
    path: "/results",
    icon: icon("ic_result"),
    isAdmin: true,
    isCandidate: false,
  },
  {
    title: "Users",
    path: "/user",
    icon: icon("ic_users"),
    isAdmin: true,
    isCandidate: false,
  },
  {
    title: "Designation",
    path: "/designation",
    icon: icon("ic_result"),
    isAdmin: true,
    isCandidate: false,
  },
  {
    title: "assessment",
    path: "/candidate/assessments",
    icon: icon("ic_assessment"),
    isAdmin: false,
    isCandidate: true,
  },
];

export default navConfig;
