const Menuitems = [
  {
    icon: '/sidebar/dashboard.png',
    label: "Dashboard",
    href: "/dashboard",
  },

  {
    icon: '/sidebar/branch.png',
    label: "Branch",
    href: "/branch",
  },

  {
    icon: '/sidebar/course.png',
    label: "Course",
    href: "/course/all-courses",
    items: [   
      {
        label: "All Courses",
        href: "/course/all-courses",
      },
      {
        label: "Document Sharing",
        href: "/course/document-sharing",
      },
    ],
  },

  {
    icon: "/sidebar/faculty.png",
    label: "Teacher",
    href: "/teacher",
  },
    {
    icon: "/sidebar/staff.png",
    label: "Staff",
    href: "/staff",
  },

  {
    icon: "/sidebar/student.png",
    label: "Student",
    href: "/student/all-students",
    items: [   // ✅
      {
        label: "All Students",
        href: "/student/all-students",
      },
      {
        label: "Certificate",
        href: "/student/certificate",
      },
    ],
  },

  {
    icon: "/sidebar/schedule.png",
    label: "Scheduling",
    href: "/timetable",
  },
  {
    icon: "/sidebar/attendence.png",
    label: "Attendance",
    href: "/attendence/punchin-punchout",
    items: [   // ✅
      {
        label: "PunchIn/punchOut",
        href: "/attendence/punchin-punchout",
      },
      {
        label: "Daily Logs",
        href: "/attendence/daily-logs",
      },
      {
        label: "Attendance Request",
        href: "/attendence/attendence-request",
      },
      {
        label:"Attendence Details",
        href:"/attendence/attendence-details",
      },
    ],
  },

  {
    icon: "/sidebar/assignments.png",
    label: "Assignments",
    href: "/assignment/all-assignments",
    items: [   // ✅
      {
        label: "All Assignments",
        href: "/assignment/all-assignments",
      },
      {
        label: "Student's Assignments",
        href: "/assignment/students-assignment",
      },
    ],
  },

  {
   icon:"/sidebar/leave.png",
   label:"Leave",
   href:"/leave/leave-status",
   items:[   // ✅
    {
      label:"Leave Status",
      href:"/leave/leave-status",
    },
    {
      label:"Leave Request",
      href:"/leave/leave-request",
    },
    {
      label:"Leave Holiday",
      href:"/leave/leave-holiday",
    },
   ]
  },
 
  {
    icon: '/sidebar/payroll.png',
    label: "Payroll",
    href: "/payroll",
  },
  {
    icon: "/sidebar/videoclass.png",
    label: "Video Class",
    href: "/video-class/live-class",
    items: [
      {
        label: "Live Class",
        href: "/video-class/live-class",
      },
      { 
        label: "Recorded Class",
        href: "/video-class/recorded-class",
      },
    ],
  },
  
  {
 icon:"/sidebar/account.png",
 label:"Account",
 href:"/account/bill",
 items: [
  {
    label:"Bill",
    href:"/account/bill",
  },
  {
    label:"Expense",
    href:"/account/expense",
  },
  {
   label:"Income",
   href:"/account/income",
  },
  
  {
  label:"Receipte",
  href:"/account/receipte",
  },
 ],

},

  
  
  {
    icon: "/sidebar/exam.png",
    label: "Exam",
    href: "/exam",
  },

  {
    icon: "/sidebar/result.png",
    label: "Results",
    href: "/result",
  },
];



export default Menuitems;
