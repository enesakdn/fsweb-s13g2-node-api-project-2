// posts için gerekli routerları buraya yazın postModel eklenecek ve ona göre tekrardan şekillendirelecek sonra diğer kısım bitirilecek devam edilecek daha sonra bitirilecek.
const express = require("express");
const router = express.Router();

const {
  find,
  findById,
  insert,
  update,
  remove,
  findPostComments,
  findCommentById,
  insertComment,
} = require("./posts-model");

router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const post = await find();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Gönderiler Alınamadı" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await findById(id);
    if (!post) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      res.status(201).json(post);
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderiler Alınamadı" });
  }
});

router.post("/", async (req, res) => {
  const { title, contents } = req.body;
  try {
    if (!title || !contents) {
      res.status(400).json({
        message: "Lütfen gönderi için bir title ve contents sağlayın",
      });
    } else {
      const newid = await insert({ title: title, contents: contents });
      const newpost = await findById(newid.id);
      res.status(201).json(newpost);
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderiler Alınamadı" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await findById(id);
    if (!post) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      const { title, contents } = req.body;
      if (!title || !contents) {
        res
          .status(400)
          .json({ message: "Lütfen gönderi için title ve contents sağlayın" });
      } else {
        const newUser = await update(id, { title: title, contents: contents });
        const updateNewUser = await findById(newUser);
        res.status(200).json(updateNewUser);
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderiler Alınamadı" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await findById(id);
  try {
    if (!user) {
      res.status(404).json({ message: "Belirtilen ID li gönderi bulunamadı" });
    } else {
      const newdelete = await remove(id);
      res.status(201).json(user);
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderiler Alınamadı" });
  }
});

router.get(`/:id/comments`, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await findById(id);
    if (post) {
      const comments = await findPostComments(id);
      res.status(200).json(comments);
    } else {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    }
  } catch {
    res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
  }
});

module.exports = router;
