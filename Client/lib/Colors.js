const commonColor = {
  commonWhite: "#FFFFFF",
  commonBlack: "#000000",
  logoGreen: "#27B08B",
  checkGreen: "#00D8D8",
  activeRed: "#EB4335",
};

const Colors = {
  light: {
    themeColor: "#FFFFFF",
    text: "#000000",
    settingPressable: "#D9D9D9",
    profileCard: "#EFEFEF",
    wannaKnow: "#C4C3C3",
    messsageCompose: "#FFFFFF",
    dividerLine: "#D9D9D9",
    wishCardBg: "#FFFFFF",
    ...commonColor,
  },

  dark: {
    themeColor: "#0E1116",
    text: "#FFFFFF",
    settingPressable: "#29313E",
    profileCard: "#323539",
    wannaKnow: "#D9D9D9",
    messsageCompose: "#1F2329",
    dividerLine: "#2d2d2ea3",
    wishCardBg: "#4A576E",
    ...commonColor,
  },
};
export default Colors;
