export const CustomAvatar = ({ ensImage, size }) => {
  const color = "aqua";
  return ensImage ? (
    <img src={ensImage} width={size} height={size} style={{ borderRadius: 999 }} alt="" />
  ) : (
    <div
      style={{
        backgroundColor: color,
        borderRadius: 999,
        height: size,
        width: size,
      }}
    >
      :^)
    </div>
  );
};
