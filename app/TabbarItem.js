import Router from "next/navigation";
import React from "react";

function TabBarItem({
  active = false,
  icon,
  label = "",
  path = "/",
  onClick = null,
}) {
  let center_end = "flex flex-col items-center justify-end";
  let IconComponent = icon;
  return (
    <div
      className={`${center_end} gap-1 cursor-pointer  grow basis-0`}
      onClick={() => {
        if (onClick !== null) {
          onClick();
        } else {
          Router.push(path);
        }
      }}
    >
      <div className={`${center_end}`}>
        <IconComponent
          style={{
            color: active ? "black" : "grey",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </div>
      {/* <p
        style={{
          fontSize: "10px",
          padding: 0,
          margin: 0,
          color: active ? "var(--monevBlue-700)" : "var(--monevGrey-500)",
        }}
      >
        {label}
      </p> */}
    </div>
  );
}

export default TabBarItem;
