export const SCENARIOS = [
    {
        id: "start",
        title: "Getting Started",
        text: "You just turned 18. What is your first step to participate in the election?",
        options: [
            {
                text: "Register as a voter",
                correct: true,
                feedback: "Correct! Registration is the first step to becoming an eligible voter.",
                consequence: "You are now on your way to becoming a registered voter."
            },
            {
                text: "Go directly to the polling booth",
                correct: false,
                feedback: "Oops! You cannot vote without being registered in the electoral roll first.",
                consequence: "The polling officer asks for your EPIC card, which you don't have yet."
            },
            {
                text: "Wait for a letter from the government",
                correct: false,
                feedback: "Incorrect. You must proactively register yourself once you turn 18.",
                consequence: "Years pass, and you remain unregistered and unable to vote."
            }
        ]
    },
    {
        id: "registration",
        title: "Voter Registration",
        text: "How would you like to register yourself as a voter?",
        options: [
            {
                text: "Use the Voter Helpline App",
                correct: true,
                feedback: "Excellent! The Voter Helpline App (or NVSP portal) is the fastest way to register.",
                consequence: "You open the app and start filling out Form 6."
            },
            {
                text: "Post a status on Social Media",
                correct: false,
                feedback: "That won't work! Social media posts are not official registration methods.",
                consequence: "You get many likes, but you are still not a registered voter."
            },
            {
                text: "Visit a local bank",
                correct: false,
                feedback: "Incorrect. Banks do not handle voter registration.",
                consequence: "The bank manager is confused and directs you to the ERO office."
            }
        ]
    }
];
