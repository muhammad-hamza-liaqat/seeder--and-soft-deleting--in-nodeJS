const nodemailer = require("nodemailer");
const Queue = require("bull");
const JobModel = require("../models/jobModel");

async function saveDataJobCollection(jobData) {
  try {
    const detail = jobData;
    var jobDocument = await JobModel.create({
      detail,
    });
    console.log("data saved to the database- email");
    return jobDocument;
  } catch (error) {
    console.error("error saving job data to DB", error);
    throw error;
  }
}

const emailQueue = new Queue("email", {
  limiter: {
    max: 10,
    duration: 1000,
  },
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mh408800@gmail.com",
    pass: "fqplkcnwytbhzjjc",
  },
});

emailQueue.process(async (job) => {
  const { to, subject, text } = job.data;
  const mainOptions = {
    from: "mh408800@gmail.com",
    to,
    subject,
    text,
  };
  try {
    const jobDb = await saveDataJobCollection(job.data);

    await transporter.sendMail(mainOptions);
    console.log(`Email sent to ${to}`);

    setTimeout(async () => {
      await JobModel.deleteOne({ _id: jobDb.id });
      console.log("Job removed from MongoDB:", jobDb.id);
    }, 10000); //10 sec

    transporter.close();
  } catch (error) {
    console.error("Error processing email job:", error.message);
  }
});

// Handle completed jobs
emailQueue.on("completed", (job) => {
  console.log(`Job ${job.id} has been completed`);
});

// Handle errors
emailQueue.on("failed", (job, error) => {
  console.error(`Job ${job.id} failed:`, error.message);
});

module.exports = { emailQueue };
