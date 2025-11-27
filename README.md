# scrumboard3000

An imlementation of a Scrumboard, used in Agile-project methodology, leveraging a custom non-server based authentication method (No passwords stored in database, no server-based authentication -> All computationally heavy tasks are performed on user machine so as to be scalable to any number of user machines).

- Has three types of Users : Managers, Developers and Clients
- Manager : Reflects a project manager, can start projects where features are developed by developer teams (A specific Manager manages their developer-teams ; And can assign these to specific feature development) who are tasked with divvying up the workflow of the features into concrete tasks. The features are negoiated with a Client and assigned to a team of developers with the necessary competence profile. 
- Developer : A developer is any User in charge of developing some feature, a developer can have an arbitrary amount of `types` (For example : "Front-end, back-end, graphics, marketing") that can be used to sort them into suitable tasks
- Client : The Client queries the start of a specific Project and can log in to see the development of the Project as a whole or specific features at any time

- The Manager/Developer/Client-based architecture enforces the "encapsulation of the workflow", where the competences of each user type is used as a basis for their actions inside any given project : A Manager can only start features, then the specifics of that feature and the specifics of the completion of that feature is delegated to developers with specific competence to handle that feature. A Client can at any time see how their project fares and the progression /hindrances for any wanted feature-development and can modulate their expectations given the specifics of the Project. Furthermore, the TimeConstraints used in development offers a robust way to plan out a given "sprint", in Agile-terminology and offers a way to report early completion as well as update any given timeframe or choosing to abandon some feature or sub-task inside a feature due to time-constraints inherent to the project  


- Leverages assymetric encryption methods for inter-user communication
- Uses AES-GCM to fortify any instance against eavesdropping, manipulation or unauthorized access ; Reflecting the need of such measures in proprietary development
- Derives new keys per log out, ensures forward-secrecy on a per login basis
- Uses heavily fortified encryption leveraging the user-machine-based approach for robust, scalable security (Since even robust encryption-operations are only computationally/temporally challenging when needed to perform several in parallel - Usually at the server side of any web-application)
- Actively works to minimize exposure time of any sensitive data in local memory
-  Measures against rainbow-table attacks (In addition to standard cryptographical measures against rainbow-table attacks)
-  Measures to ensure cryptographically secure credential generation no matter the specifics of user credential-choice
-  Any data sent is sent over HTTPS, ensuring (reasonable, not perfect) data-security in transit to Firebase DB
-  No local User has access to any other user´s sensitive data, thus isolating any security compromises to one specific user and not the system. Can be leveraged so that no one except the manager/client has access to any given project in its entirety, minimizing proprietary information-leakage for any project

Developments/Improvement-points : 
- Custom server-implementation with User-specific security rules 
- Mechanisms to spot and notify users of compromised credentials 
- Different security profiles for projects to reflect different Project´s threat models
- Implement actual Dev/Manager/Client role based access-structure -> In current version : All involved users count as both "managers" (can assign devs to specific tasks/features) and "developers" (Can add tasks to any feature)
- Implement post-quantum cryptography
