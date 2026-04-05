import { userModel } from "../models/userModel.js";
import { bookModel } from "../models/bookModel.js";
import { issueModel } from "../models/issueModel.js";
import { asyncErrorHandler } from "../middlewares/asyncErrorMiddleware.js";
import { calculateFine } from "../utils/calculateFine.js"; 

export const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Students Count (role: 'user')
    // FIX: User ki jagah userModel use kiya
    const totalStudents = await userModel.countDocuments({ role: 'user' });

    // 2. Pending Verifications
    const pendingVerifications = await userModel.countDocuments({ 
      role: 'user', 
      adminApproved: 'pending' 
    });

    // 3. Active Borrowers (Approved issues but not returned yet)
    // Assuming status stays 'approved' until returned
    const activeIssues = await issueModel.distinct("user", { status: "approved" });
    const activeUsers = activeIssues.length;

    // 4. Total Fine Collection
    // FIX: User ki jagah userModel use kiya
    const fineData = await userModel.aggregate([
      { $match: { role: 'user' } },
      { $group: { _id: null, totalFine: { $sum: "$fine" } } }
    ]);
    
    const totalFine = fineData.length > 0 ? fineData[0].totalFine : 0;

    // 5. Total Books in Inventory
    const totalBooks = await bookModel.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        activeUsers, 
        pendingVerifications,
        totalFine,
        totalBooks
      }
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error while fetching dashboard intelligence",
    });
  }
};

export const getAllStudents = asyncErrorHandler(async (req, res, next) => {
    
    const students = await userModel.find({ role: 'user' }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: students.length,
        students
    });
});

// 2. APPROVE OR REJECT STUDENT: Update the adminApproved status
export const updateStudentStatus = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body; 

    // Validate the incoming status against your enum
    if (!['approved', 'rejected'].includes(status)) {
        return next(new ErrorHandler(400, 'Invalid status update. Use "approved" or "rejected".'));
    }

    const student = await userModel.findById(id);

    if (!student) {
        return next(new ErrorHandler(404, 'Student record not found.'));
    }

    student.adminApproved = status;
    await student.save();

    res.status(200).json({
        success: true,
        message: `Student account has been ${status} successfully.`,
        student
    });
});

// 3. DELETE STUDENT: Purge a student from the system
export const deleteStudent = asyncErrorHandler(async (req, res, next) => {
    const student = await userModel.findById(req.params.id);

    if (!student) {
        return next(new ErrorHandler(404, 'Student not found in the registry.'));
    }

    await student.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Student account deleted successfully.'
    });
});



export const getAdminReturnRequests = asyncErrorHandler(async (req, res, next) => {

    const requests = await issueModel.find({ status: "return_requested" })
        .populate("user", "name email rollNumber branch year semester")
        .populate("book", "title author price isbn image");

    
    const requestsWithFine = requests.map(record => {
        const fine = calculateFine({
            dueDate: record.dueDate,
            returnDate: new Date(), 
            finePerDay: 5, 
            graceDays: 0,
            maxFine: 1000
        });

        return {
            ...record._doc,
            currentFine: fine 
        };
    });

    res.status(200).json({
        success: true,
        requests: requestsWithFine
    });
});

 export const deleteUnverifiedUsers = async (req, res) => {
  try {
    
    const result = await userModel.deleteMany({ accountVerified: false });

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} unverified users deleted successfully.`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error: Could not delete users",
      error: error.message
    });
  }
};