/**
 * Election Learning Assistant - Scenario Step Pool
 * 
 * Contains randomized question sets with detailed simulations 
 * for both SUCCESS and FAILURE paths.
 */

const STEP_POOL = [
    {
        id: 1,
        title: "Eligibility Check",
        questionSets: [
            {
                question: "You want to participate in the upcoming elections. What is the primary requirement to be a voter in India?",
                hint: "Age is just a number, but for voting, it's a specific one!",
                options: [
                    { 
                        text: "Being at least 18 years old", 
                        correct: true 
                    },
                    { 
                        text: "Having a college degree", 
                        correct: false,
                        simulation: [
                            { text: "Scanning Educational Database...", sub: "Querying national records for degree credentials." },
                            { text: "Degree Verified: B.A.", sub: "However, education is NOT a voting requirement." },
                            { text: "❌ Registration Denied", sub: "Eligibility depends on age, not academic qualification." }
                        ]
                    },
                    { 
                        text: "Paying income tax", 
                        correct: false,
                        simulation: [
                            { text: "Checking IT Department records...", sub: "Looking for tax payment history." },
                            { text: "Status: Non-Taxpayer", sub: "User has no recent tax filings." },
                            { text: "❌ Logic Halted", sub: "Voting is a fundamental right, not a paid privilege." }
                        ]
                    }
                ],
                simulation: [
                    { text: "Verifying citizenship records...", sub: "Cross-referencing with national database." },
                    { text: "Checking date of birth...", sub: "Calculating age from official records." },
                    { text: "Validation Successful", sub: "Status: ELIGIBLE" }
                ],
                recap: "You've successfully verified your eligibility. In India, any citizen aged 18 or above can participate."
            }
        ]
    },
    {
        id: 2,
        title: "Registration Method",
        questionSets: [
            {
                question: "How will you register yourself in the electoral roll in the modern 'Digital India' era?",
                hint: "Digital India has made this very easy from your smartphone!",
                options: [
                    { 
                        text: "Voter Helpline App", 
                        correct: true 
                    },
                    { 
                        text: "Send a WhatsApp to the PM", 
                        correct: false,
                        simulation: [
                            { text: "Opening WhatsApp Messenger...", sub: "Attempting to send a direct message." },
                            { text: "Message Sent to 'PMO'...", sub: "Waiting for automated confirmation." },
                            { text: "❌ No Action Taken", sub: "Official registration must use ECI-approved portals." }
                        ]
                    },
                    { 
                        text: "Visit a local police station", 
                        correct: false,
                        simulation: [
                            { text: "Navigating to Police Station...", sub: "Walking to the nearest government outpost." },
                            { text: "Meeting Duty Officer...", sub: "Requesting help with voter ID." },
                            { text: "❌ Redirected", sub: "Officer directs you to the ERO office or Online portal." }
                        ]
                    }
                ],
                simulation: [
                    { text: "Downloading Voter Helpline App...", sub: "Fetching official app from Play Store." },
                    { text: "Launching Application...", sub: "Initializing secure registration module." },
                    { text: "✅ App Ready", sub: "Proceeding to registration portal." }
                ],
                recap: "Using the official app ensures your data goes directly to the Election Commission for processing."
            }
        ]
    },
    {
        id: 3,
        title: "Form Selection",
        questionSets: [
            {
                question: "You are registering for the first time. Which form should you fill out?",
                hint: "Look for the primary form for 'New Voter Registration'.",
                options: [
                    { 
                        text: "Form 6", 
                        correct: true 
                    },
                    { 
                        text: "Form 7", 
                        correct: false,
                        simulation: [
                            { text: "Opening Form 7...", sub: "Loading deletion and objection document." },
                            { text: "System Warning...", sub: "This form is used to DELETE a name from the list." },
                            { text: "❌ Error Detected", sub: "You want to ADD your name, not remove someone else's." }
                        ]
                    },
                    { 
                        text: "Form 8", 
                        correct: false,
                        simulation: [
                            { text: "Opening Form 8...", sub: "Loading correction and shifting document." },
                            { text: "Searching existing ID...", sub: "Checking if you are already a registered voter." },
                            { text: "❌ Name Not Found", sub: "Use Form 6 for your initial registration journey." }
                        ]
                    }
                ],
                simulation: [
                    { text: "Opening Form 6...", sub: "Loading first-time registration form." },
                    { text: "Verifying Mobile Number...", sub: "Sending secure OTP." },
                    { text: "✅ Initialized", sub: "Ready for data entry." }
                ],
                recap: "Selecting the right form is crucial. Form 6 is your gateway to becoming a registered voter."
            }
        ]
    },
    {
        id: 4,
        title: "Document Verification",
        questionSets: [
            {
                question: "Which of these is a valid 'Proof of Age' for registration?",
                hint: "You need a government-issued document that clearly states your date of birth.",
                options: [
                    { 
                        text: "Birth Certificate or Aadhaar", 
                        correct: true 
                    },
                    { 
                        text: "Library Membership Card", 
                        correct: false,
                        simulation: [
                            { text: "Scanning Library Card...", sub: "Attempting to extract official DOB records." },
                            { text: "Validation Failed", sub: "Document is not a government-issued ID." },
                            { text: "❌ Rejected", sub: "Please upload an official Birth Certificate or Aadhaar." }
                        ]
                    },
                    { 
                        text: "School Playground Pass", 
                        correct: false,
                        simulation: [
                            { text: "Scanning Pass...", sub: "Analyzing document for official seal." },
                            { text: "❌ Invalid Entry", sub: "Utility or private passes are not valid legal proof." }
                        ]
                    }
                ],
                simulation: [
                    { text: "Scanning Identity Card...", sub: "Extracting DOB information." },
                    { text: "Uploading to Server...", sub: "Securely storing document." },
                    { text: "✅ Verified", sub: "Age criteria satisfied." }
                ],
                recap: "Digital documentation speeds up the verification process. Always ensure your uploads are clear."
            }
        ]
    },
    {
        id: 5,
        title: "Final Step: Voting",
        questionSets: [
            {
                question: "What is the last thing you do after pressing the EVM button?",
                hint: "The VVPAT machine next to the EVM is there for a reason.",
                options: [
                    { 
                        text: "Check the VVPAT slip", 
                        correct: true 
                    },
                    { 
                        text: "Take a selfie with the machine", 
                        correct: false,
                        simulation: [
                            { text: "Taking Phone Out...", sub: "Attempting to capture a selfie with the EVM." },
                            { text: "Security Alert...", sub: "Polling officer intervenes immediately." },
                            { text: "❌ Device Confiscated", sub: "Photography is strictly prohibited inside the booth." }
                        ]
                    },
                    { 
                        text: "Ask the officer who to vote for", 
                        correct: false,
                        simulation: [
                            { text: "Approaching Polling Officer...", sub: "Asking for advice on candidate selection." },
                            { text: "Officer Refuses...", sub: "The officer reminds you of 'Ballot Secrecy'." },
                            { text: "❌ Halted", sub: "It is your private choice and duty to decide." }
                        ]
                    }
                ],
                simulation: [
                    { text: "Pressing EVM Button...", sub: "Recording vote for candidate." },
                    { text: "Verifying VVPAT Screen...", sub: "Confirming symbol on paper slip." },
                    { text: "✅ Vote Casted", sub: "Participation complete." }
                ],
                recap: "Congratulations! You have successfully exercised your most powerful right in a democracy."
            }
        ]
    }
];

// Global scope access
window.STEP_POOL = STEP_POOL;
