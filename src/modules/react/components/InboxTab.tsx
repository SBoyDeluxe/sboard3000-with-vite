import { useMailboxContentStore } from "../store/UserStore";
import { getKeysForList } from "./ProjectsTab";



/**
 * Generates the contents of a users inbox
 */
export function InboxTab() {

    const mailboxStore = useMailboxContentStore();

    const keysForMail = (typeof mailboxStore !== "undefined") ? getKeysForList(mailboxStore) : null;
    let contents: React.ReactNode = (<></>);
    if (keysForMail !== null) {
        contents = mailboxStore!.map((mail, index) => {

            return (<li key={keysForMail[index]}><p >{mail}</p> </li>)

        });
    }
    return (
        <ul >
            {contents}
        </ul>
    )


}