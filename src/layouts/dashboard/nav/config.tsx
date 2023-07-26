// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: icon('ic_dashboard'),
  },
  {
    title: 'assessments',
    path: '/assessments',
    icon: icon('ic_assessment'),
  },
  {
    title: 'candidates',
    path: '/candidates',
    icon: icon('ic_candidate'),
  },
  {
    title: 'Staffs',
    path: '/staffs',
    icon: icon('ic_staff'),
  },
  {
    title: 'Results',
    path: '/results',
    icon: icon('ic_result'),
  },
  {
    title: 'Users',
    path: '/user',
    icon: icon('ic_users'),
  },
];

export default navConfig;
