import { useMailboxContentStore } from "../store/UserStore";
import { getKeysForList } from "./ProjectsTab";

export type InboxTabProps = {
    /**
     * The mailbox whose contents are supposed to be displayed
     */
    mailBoxContents: string[],


}

/**
 * Generates the contents of a users inbox
 */
export function InboxTab({ }: InboxTabProps) {

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