export const STEPS = [
    {
        id: 1,
        title: "Eligibility Check",
        question: "You want to participate in the upcoming elections. What is the primary requirement to be a voter in India?",
        hint: "Age is just a number, but for voting, it's a specific one! In India, it follows the principle of Universal Adult Suffrage.",
        options: [
            { 
                text: "Being at least 18 years old", 
                correct: true, 
                feedback: "Correct! Article 326 of the Constitution defines this as the age of majority for voting.",
                simulation: [
                    { text: "Verifying citizenship records...", sub: "Cross-referencing with national database." },
                    { text: "Checking date of birth...", sub: "Calculating age from official records." },
                    { text: "Validation Successful", sub: "Status: ELIGIBLE TO REGISTER" }
                ]
            },
            { 
                text: "Having a college degree", 
                correct: false, 
                feedback: "Incorrect. Education is not a requirement for voting rights in India.",
                simulation: [
                    { text: "Scanning Educational Database...", sub: "Checking for degree credentials." },
                    { text: "Degree Found: B.Tech", sub: "However, education level is not a voting criterion." },
                    { text: "❌ Access Denied", sub: "Requirement: Universal Adult Suffrage (Age), not Education." }
                ]
            },
            { 
                text: "Paying income tax", 
                correct: false, 
                feedback: "Wrong. Voting is a right for every citizen, regardless of their financial status.",
                simulation: [
                    { text: "Checking IT Department records...", sub: "Looking for tax payment history." },
                    { text: "Status: Non-Taxpayer", sub: "System flag raised for financial status." },
                    { text: "❌ Process Halted", sub: "Voting is a right, not a paid privilege." }
                ]
            }
        ],
        recap: "You've successfully verified your eligibility. In India, any citizen aged 18 or above can participate in the democratic process."
    },
    {
        id: 2,
        title: "Registration Method",
        question: "Now that you are eligible, how will you register yourself in the electoral roll?",
        hint: "Digital India has made this very easy! You can do it right from your smartphone.",
        options: [
            { 
                text: "Download Voter Helpline App", 
                correct: true, 
                feedback: "Perfect! The ECI's mobile app is the most convenient way to register.",
                simulation: [
                    { text: "Downloading Voter Helpline App...", sub: "Fetching official app from Play Store." },
                    { text: "Launching Application...", sub: "Initializing secure registration module." },
                    { text: "✅ App Ready", sub: "Proceeding to Form 6." }
                ]
            },
            { 
                text: "Send a WhatsApp message to the PM", 
                correct: false, 
                feedback: "Incorrect. WhatsApp is not an official registration channel.",
                simulation: [
                    { text: "Opening WhatsApp Messenger...", sub: "Attempting to send a message." },
                    { text: "Message Sent to 'PMO'...", sub: "Waiting for automated response." },
                    { text: "❌ No Action Taken", sub: "Official registration must use ECI portals only." }
                ]
            },
            { 
                text: "Visit a local police station", 
                correct: false, 
                feedback: "Wrong. Police stations do not handle voter registration.",
                simulation: [
                    { text: "Navigating to Police Station...", sub: "Walking to the nearest station." },
                    { text: "Talking to Duty Officer...", sub: "Requesting voter registration." },
                    { text: "❌ Redirected", sub: "Officer directs you to the ERO office or Online Portal." }
                ]
            }
        ],
        recap: "Using the official app ensures your data goes directly to the Election Commission for processing."
    },
    {
        id: 3,
        title: "Form Selection",
        question: "You are registering for the first time. Which form should you fill out?",
        hint: "Look for the primary form for 'New Voter Registration'.",
        options: [
            { 
                text: "Form 6", 
                correct: true, 
                feedback: "Correct! Form 6 is for first-time voter registration.",
                simulation: [
                    { text: "Opening Form 6...", sub: "Loading first-time registration form." },
                    { text: "Verifying Mobile Number...", sub: "Sending secure OTP." },
                    { text: "✅ Form 6 Initialized", sub: "Ready for document upload." }
                ]
            },
            { 
                text: "Form 7", 
                correct: false, 
                feedback: "Incorrect. Form 7 is for deletion or objection of names.",
                simulation: [
                    { text: "Opening Form 7...", sub: "Loading deletion/objection form." },
                    { text: "System Warning...", sub: "This form will delete a name from the roll." },
                    { text: "❌ Logic Error", sub: "You want to ADD a name, not delete one." }
                ]
            },
            { 
                text: "Form 8", 
                correct: false, 
                feedback: "No. Form 8 is for correction of existing entries.",
                simulation: [
                    { text: "Opening Form 8...", sub: "Loading correction/shifting form." },
                    { text: "Searching for Name...", sub: "Checking if you are already in the roll." },
                    { text: "❌ Name Not Found", sub: "You must use Form 6 for initial registration." }
                ]
            }
        ],
        recap: "Selecting the right form is crucial. Form 6 is your gateway to becoming a registered voter."
    },
    {
        id: 4,
        title: "Document Verification",
        question: "The form asks for 'Proof of Age'. Which of these is a valid document?",
        hint: "You need a government-issued document that clearly states your date of birth.",
        options: [
            { 
                text: "Birth Certificate or Aadhaar Card", 
                correct: true, 
                feedback: "Spot on! These are standard accepted documents for age proof.",
                simulation: [
                    { text: "Scanning Aadhaar Card...", sub: "Extracting DOB information." },
                    { text: "Uploading to Server...", sub: "Securely storing document." },
                    { text: "✅ Document Verified", sub: "Age criteria satisfied." }
                ]
            },
            { 
                text: "Library Membership Card", 
                correct: false, 
                feedback: "No. A library card is not an official government ID for age proof.",
                simulation: [
                    { text: "Scanning Library Card...", sub: "Attempting to extract official DOB." },
                    { text: "Validation Failed...", sub: "Document is not government-issued." },
                    { text: "❌ Upload Rejected", sub: "Please use official ID like Birth Certificate." }
                ]
            },
            { 
                text: "Electricity Bill", 
                correct: false, 
                feedback: "Wrong. An electricity bill is typically used as proof of residence.",
                simulation: [
                    { text: "Scanning Utility Bill...", sub: "Checking for DOB records." },
                    { text: "Address Found...", sub: "However, Date of Birth is missing." },
                    { text: "❌ Invalid for Age Proof", sub: "Bill only proves where you live, not when you were born." }
                ]
            }
        ],
        recap: "Digital documentation speeds up the verification process. Always ensure your uploads are clear."
    },
    {
        id: 5,
        title: "Final Step: Voting",
        question: "It's Election Day! What is the last thing you do after pressing the button on the EVM?",
        hint: "The VVPAT machine next to the EVM is there for a reason.",
        options: [
            { 
                text: "Check the VVPAT slip", 
                correct: true, 
                feedback: "Excellent! The VVPAT allows you to verify that your vote was cast correctly.",
                simulation: [
                    { text: "Pressing EVM Button...", sub: "Recording vote for chosen candidate." },
                    { text: "Verifying VVPAT Screen...", sub: "Confirming symbol on paper slip." },
                    { text: "✅ Vote Casted", sub: "Your participation is complete." }
                ]
            },
            { 
                text: "Take a selfie with the machine", 
                correct: false, 
                feedback: "Absolutely not! Photography is strictly prohibited.",
                simulation: [
                    { text: "Taking Phone Out...", sub: "Attempting to snap a selfie." },
                    { text: "Security Alert...", sub: "Polling officer intervenes." },
                    { text: "❌ Confiscated", sub: "Devices are not allowed in the compartment. Vote invalidated." }
                ]
            },
            { 
                text: "Walk out before the beep", 
                correct: false, 
                feedback: "No. You must ensure the vote is registered.",
                simulation: [
                    { text: "Pressing Button...", sub: "Initiating vote process." },
                    { text: "Walking out quickly...", sub: "Exiting the compartment prematurely." },
                    { text: "❌ Incomplete", sub: "System did not register the 'BEEP'. Your vote may not have counted." }
                ]
            }
        ],
        recap: "Congratulations! You have successfully navigated the journey of a voter."
    }
];
