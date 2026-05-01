export const STEP_POOL = [
    {
        id: 1,
        title: "Eligibility Check",
        questionSets: [
            {
                question: "You want to participate in the upcoming elections. What is the primary requirement to be a voter in India?",
                hint: "Age is just a number, but for voting, it's a specific one!",
                options: [
                    { text: "Being at least 18 years old", correct: true },
                    { text: "Having a college degree", correct: false },
                    { text: "Paying income tax", correct: false }
                ],
                simulation: [
                    { text: "Verifying citizenship records...", sub: "Cross-referencing with national database." },
                    { text: "Checking date of birth...", sub: "Calculating age from official records." },
                    { text: "Validation Successful", sub: "Status: ELIGIBLE" }
                ],
                recap: "You've successfully verified your eligibility. In India, any citizen aged 18 or above can participate."
            },
            {
                question: "You reached the polling booth but your name is not on the list. Which criteria should you have checked earlier?",
                hint: "Eligibility is more than just age; you must be present on the 'Electoral Roll'.",
                options: [
                    { text: "Inclusion in the Electoral Roll", correct: true },
                    { text: "Your social media follower count", correct: false },
                    { text: "The color of your ink", correct: false }
                ],
                simulation: [
                    { text: "Searching Electoral Roll...", sub: "Querying EPIC database for your name." },
                    { text: "Entry Found: Ward 12", sub: "Name is correctly listed in the constituency." },
                    { text: "✅ Enrollment Confirmed", sub: "You are ready to proceed." }
                ],
                recap: "Being 18 is the first step, but being on the list (Electoral Roll) is what grants you the actual vote."
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
                    { text: "Voter Helpline App", correct: true },
                    { text: "Post a letter to the Prime Minister", correct: false },
                    { text: "Visit a local police station", correct: false }
                ],
                simulation: [
                    { text: "Downloading Voter Helpline App...", sub: "Fetching official app from Store." },
                    { text: "Launching Application...", sub: "Initializing secure registration module." },
                    { text: "✅ App Ready", sub: "Proceeding to registration portal." }
                ],
                recap: "Using the official app ensures your data goes directly to the Election Commission for processing."
            },
            {
                question: "If you don't have a smartphone, where can you go physically to register as a voter?",
                hint: "There is a specific officer in every constituency in charge of the rolls.",
                options: [
                    { text: "Office of the ERO", correct: true },
                    { text: "The nearest Post Office", correct: false },
                    { text: "The local grocery store", correct: false }
                ],
                simulation: [
                    { text: "Navigating to ERO Office...", sub: "Locating the nearest government administrative building." },
                    { text: "Meeting Booth Level Officer...", sub: "Inquiring about physical Form 6 availability." },
                    { text: "✅ Location Reached", sub: "Starting physical application process." }
                ],
                recap: "Whether online or offline, the ECI provides multiple paths to ensure no citizen is left behind."
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
                    { text: "Form 6", correct: true },
                    { text: "Form 7", correct: false },
                    { text: "Form 8", correct: false }
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
                    { text: "Birth Certificate or Aadhaar", correct: true },
                    { text: "Library Membership Card", correct: false },
                    { text: "School Playground Pass", correct: false }
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
                    { text: "Check the VVPAT slip", correct: true },
                    { text: "Take a selfie with the machine", correct: false },
                    { text: "Ask the officer who to vote for", correct: false }
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
