export const STEPS = [
    {
        id: 1,
        title: "Eligibility Check",
        questionVariants: [
            "What is the primary requirement to be a voter in India?",
            "At what age does a citizen become eligible to vote in Indian elections?",
            "Which of these is the most important criteria for being registered as a voter?"
        ],
        hintVariants: [
            "Age is just a number, but for voting, it's exactly 18!",
            "It follows the principle of Universal Adult Suffrage.",
            "You need to reach the legal age of majority first."
        ],
        options: [
            { 
                textVariants: ["Being at least 18 years old", "Reaching the age of 18", "Being 18+ years of age"],
                correct: true, 
                feedback: "Correct! Article 326 of the Constitution defines this as the age of majority for voting.",
                simulation: [
                    { text: "Verifying citizenship records...", sub: "Cross-referencing with national database." },
                    { text: "Checking date of birth...", sub: "Calculating age from official records." },
                    { text: "Validation Successful", sub: "Status: ELIGIBLE TO REGISTER" }
                ]
            },
            { 
                textVariants: ["Having a college degree", "Completing graduation", "Educational qualifications"],
                correct: false, 
                feedback: "Incorrect. Education is not a requirement for voting rights in India.",
                simulation: [
                    { text: "Scanning Educational Database...", sub: "Checking for degree credentials." },
                    { text: "❌ Access Denied", sub: "Requirement: Age, not Education." }
                ]
            },
            { 
                textVariants: ["Paying income tax", "Being a taxpayer", "Financial contribution to govt"],
                correct: false, 
                feedback: "Wrong. Voting is a right for every citizen, regardless of their financial status.",
                simulation: [
                    { text: "Checking IT Department records...", sub: "Looking for tax history." },
                    { text: "❌ Process Halted", sub: "Voting is a right, not a paid privilege." }
                ]
            }
        ],
        recap: "You've successfully verified your eligibility. In India, any citizen aged 18 or above can participate."
    },
    {
        id: 2,
        title: "Registration Method",
        questionVariants: [
            "How will you register yourself in the electoral roll?",
            "What is the best modern way to apply for a voter ID?",
            "Which platform should a new voter use for registration?"
        ],
        hintVariants: [
            "Digital India has made this very easy from your smartphone!",
            "Look for the official app provided by the Election Commission.",
            "Avoid unofficial channels; stick to the government's digital portal."
        ],
        options: [
            { 
                textVariants: ["Voter Helpline App", "Download official VHA app", "Use the ECI mobile portal"],
                correct: true, 
                feedback: "Perfect! The ECI's mobile app is the most convenient way to register.",
                simulation: [
                    { text: "Downloading Voter Helpline App...", sub: "Fetching official app from Store." },
                    { text: "Launching Application...", sub: "Initializing secure registration module." },
                    { text: "✅ App Ready", sub: "Proceeding to Form 6." }
                ]
            },
            { 
                textVariants: ["Send a WhatsApp message", "WhatsApp the PMO", "Text your local representative"],
                correct: false, 
                feedback: "Incorrect. WhatsApp is not an official registration channel.",
                simulation: [
                    { text: "Opening WhatsApp...", sub: "Attempting to send a message." },
                    { text: "❌ No Action", sub: "Official registration must use ECI portals." }
                ]
            },
            { 
                textVariants: ["Visit a local police station", "Go to the police station", "Report to nearest PS"],
                correct: false, 
                feedback: "Wrong. Police stations do not handle voter registration.",
                simulation: [
                    { text: "Navigating to Police Station...", sub: "Walking to the nearest station." },
                    { text: "❌ Redirected", sub: "Officer directs you to the ERO office or Online Portal." }
                ]
            }
        ],
        recap: "Using the official app ensures your data goes directly to the Election Commission for processing."
    },
    {
        id: 3,
        title: "Form Selection",
        questionVariants: [
            "Which form should you fill out as a first-time voter?",
            "Select the correct form for new registration.",
            "As a new elector, which document must you initialize?"
        ],
        hintVariants: [
            "Look for the primary form for 'New Voter Registration'.",
            "It's the very first form in the registration list.",
            "Form numbers vary by purpose; this one is for 'Addition' to the roll."
        ],
        options: [
            { 
                textVariants: ["Form 6", "Apply via Form 6", "Select Form 6"],
                correct: true, 
                feedback: "Correct! Form 6 is for first-time voter registration.",
                simulation: [
                    { text: "Opening Form 6...", sub: "Loading first-time registration form." },
                    { text: "Verifying Mobile Number...", sub: "Sending secure OTP." },
                    { text: "✅ Initialized", sub: "Ready for document upload." }
                ]
            },
            { 
                textVariants: ["Form 7", "Fill Form 7", "Choose Form 7"],
                correct: false, 
                feedback: "Incorrect. Form 7 is for deletion or objection of names.",
                simulation: [
                    { text: "Opening Form 7...", sub: "Loading deletion form." },
                    { text: "❌ Logic Error", sub: "You want to ADD a name, not delete one." }
                ]
            },
            { 
                textVariants: ["Form 8", "Navigate to Form 8", "Start Form 8"],
                correct: false, 
                feedback: "No. Form 8 is for correction of existing entries.",
                simulation: [
                    { text: "Opening Form 8...", sub: "Loading correction form." },
                    { text: "❌ Name Not Found", sub: "You must use Form 6 for initial registration." }
                ]
            }
        ],
        recap: "Selecting the right form is crucial. Form 6 is your gateway to becoming a registered voter."
    },
    {
        id: 4,
        title: "Document Verification",
        questionVariants: [
            "Which of these is a valid 'Proof of Age'?",
            "What document can you upload to verify your date of birth?",
            "Select an accepted document for age verification."
        ],
        hintVariants: [
            "You need a government-issued document stating your DOB.",
            "Aadhaar or Birth Certificate are the standard choices.",
            "Think of a document that officially records your entry into this world."
        ],
        options: [
            { 
                textVariants: ["Birth Certificate or Aadhaar Card", "Aadhaar Card / Birth Certificate", "Official Govt ID with DOB"],
                correct: true, 
                feedback: "Spot on! These are standard accepted documents for age proof.",
                simulation: [
                    { text: "Scanning Identity Card...", sub: "Extracting DOB information." },
                    { text: "Uploading to Server...", sub: "Securely storing document." },
                    { text: "✅ Verified", sub: "Age criteria satisfied." }
                ]
            },
            { 
                textVariants: ["Library Membership Card", "School Library Card", "Private Membership ID"],
                correct: false, 
                feedback: "No. A library card is not an official government ID for age proof.",
                simulation: [
                    { text: "Scanning Library Card...", sub: "Checking for official seal." },
                    { text: "❌ Rejected", sub: "Document is not government-issued." }
                ]
            },
            { 
                textVariants: ["Electricity Bill", "Utility / Electric Bill", "Proof of Residence (Bill)"],
                correct: false, 
                feedback: "Wrong. An electricity bill is typically used as proof of residence.",
                simulation: [
                    { text: "Scanning Utility Bill...", sub: "Checking for DOB records." },
                    { text: "❌ Invalid", sub: "Bill only proves residence, not age." }
                ]
            }
        ],
        recap: "Digital documentation speeds up the verification process. Always ensure your uploads are clear."
    },
    {
        id: 5,
        title: "Final Step: Voting",
        questionVariants: [
            "What is the last thing you do after pressing the EVM button?",
            "How do you confirm your vote has been recorded correctly?",
            "What should you check before leaving the polling compartment?"
        ],
        hintVariants: [
            "The VVPAT machine next to the EVM is there for a reason.",
            "Look for the paper trail confirmation.",
            "A small slip appears for 7 seconds—make sure it's correct."
        ],
        options: [
            { 
                textVariants: ["Check the VVPAT slip", "Verify VVPAT window", "Wait for VVPAT confirmation"],
                correct: true, 
                feedback: "Excellent! The VVPAT allows you to verify that your vote was cast correctly.",
                simulation: [
                    { text: "Pressing EVM Button...", sub: "Recording vote for candidate." },
                    { text: "Verifying VVPAT Screen...", sub: "Confirming symbol on paper slip." },
                    { text: "✅ Vote Casted", sub: "Participation complete." }
                ]
            },
            { 
                textVariants: ["Take a selfie with the machine", "Snap a photo of the EVM", "Capture the moment on phone"],
                correct: false, 
                feedback: "Absolutely not! Photography is strictly prohibited.",
                simulation: [
                    { text: "Taking Phone Out...", sub: "Attempting to snap a selfie." },
                    { text: "❌ Confiscated", sub: "Devices not allowed. Vote invalidated." }
                ]
            },
            { 
                textVariants: ["Walk out before the beep", "Exit immediately", "Leave without waiting"],
                correct: false, 
                feedback: "No. You must ensure the vote is registered.",
                simulation: [
                    { text: "Walking out quickly...", sub: "Exiting prematurely." },
                    { text: "❌ Incomplete", sub: "System did not register the 'BEEP'." }
                ]
            }
        ],
        recap: "Congratulations! You have successfully navigated the journey of a voter."
    }
];
