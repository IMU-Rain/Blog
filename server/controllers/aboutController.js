const About = require("../models/about");
// 创建关于页文章
const createAbout = async (req, res) => {
  try {
    const aboutData = JSON.parse(req.body.content);
    const about = new About(aboutData);
    const saved = await about.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// 更新关于页文章
const updateAbout = async (req, res) => {
  try {
    const { content } = req.body;
    const updated = await About.findOneAndUpdate(
      {},
      { content },
      { new: true, upsert: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// 获取关于页文章
const getAbout = async (req, res) => {
  try {
    const aboutData = await About.find({});
    const about = aboutData[0];
    if (!about) {
      res.status(404).json({ error: "未找到文章, 请联系Max Byte" });
    }
    res.status(200).json(about);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports = {
  getAbout,
  createAbout,
  updateAbout,
};
