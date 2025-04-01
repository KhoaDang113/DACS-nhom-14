const categoryModel = require("../models/category.model");

const getAllCategory = async (req, res) => {
  try {
    const categories = await categoryModel
      .find({ parentCategory: null })
      .lean();

    const categoriesChildren = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await categoryModel
          .find({ parentCategory: category._id })
          .lean();
        const subcategoriesWithChildren = await Promise.all(
          subcategories.map(async (subcategory) => {
            const subcategoryChildren = await categoryModel
              .find({ parentCategory: subcategory._id })
              .lean();
            return { ...subcategory, subcategoryChildren };
          })
        );

        return { ...category, subcategories: subcategoriesWithChildren };           
      })
    );
    return res.json(categoriesChildren);

    // const categories = await categoryModel.aggregate([
    //   {
    //     $match: { parentCategory: null },
    //   },
    //   {
    //     $lookup: {
    //       from: "categories",
    //       localField: "_id",
    //       foreignField: "parentCategory",
    //       as: "subcategories",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$subcategories",
    //       preserveNullAndEmptyArrays: true, // Giữ lại danh mục không có subcategories
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "categories",
    //       localField: "subcategories._id",
    //       foreignField: "parentCategory",
    //       as: "subcategories.subcategories", // Lấy danh mục con cấp 3
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$_id",
    //       name: { $first: "$name" },
    //       subcategories: {
    //         $push: {
    //           _id: "$subcategories._id",
    //           name: "$subcategories.name",
    //           subcategories: "$subcategories.subcategories",
    //         },
    //       },
    //     },
    //   },
    // ]);
    // return res.json(categories);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = { getAllCategory };
