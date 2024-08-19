const home = async (req, res) => {
  try {
    res.status(200).json({ message: "Home Connection" });
    console.log("home page");
  } catch (e) {
    console.error(e);
    return {
      error: true,
      details: e,
    };
  }
};

module.exports = { home };
