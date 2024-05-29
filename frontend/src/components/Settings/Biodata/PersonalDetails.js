import { Names } from "./Name";
import { Quote } from "./Quote";
import { DOB } from "./Dob";
import { Location } from "./Location";


export function PersonalDetails(props){

    return (
        <div className="sect-cont p-3">
            <p className="hd">Edit Personal Details</p>

            <div className="about-con d-flex flex-column p-3">
                <Names />
                <Quote />
                <DOB />
                <Location />
            </div>
        </div>
    )

}