import { TouchableOpacity, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";

const OurWorkItem = ({ image, id }) => {
  function handleOurWorkPress() {
    //route to the other page passing the image as params
  }


  return (
    <Link
      href={{
        pathname: "/(zstacks)/ourwork",
        params: {
          id: id,
        },
      }}
      asChild
    >
      <TouchableOpacity
        onPress={handleOurWorkPress}
        className="w-[105px] h-[105px] m-2 rounded-full border-4 border-green-300"
      >
        <Image
          source={{ uri: image }}
          className="object-contain rounded-full w-full h-full"
        />
      </TouchableOpacity>
    </Link>
  );
};

export default OurWorkItem;
