import Icon from "@ant-design/icons";
const HomeSvg = () => {
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="currentColor"
  >
    <mask
      id="mask0_13_1405"
      style="mask-type:alpha"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="32"
      height="32"
    >
      <rect width="32" height="32" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_13_1405)">
      <path
        d="M8.00009 25.3333H12.0001V17.3333H20.0001V25.3333H24.0001V13.3333L16.0001 7.33333L8.00009 13.3333V25.3333ZM5.33342 28V12L16.0001 4L26.6668 12V28H17.3334V20H14.6668V28H5.33342Z"
        fill="black"
      />
    </g>
  </svg>;
};

const HomeIcon = (props) => <Icon component={HomeSvg} {...props} />;

export { HomeIcon };
