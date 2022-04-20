import React from 'react'
import { Row, Col } from 'react-bootstrap';
import Moment from 'react-moment';



interface ProfileProps { user:any }

const profileToDisplayMap:{[key: string]: {displayName:string, displayType:(el:any)=>any}} = {
  "firstName" : {
    displayName: "First name",
    displayType: (el:string) => el
  },
  "lastName" : {
    displayName: "Last name",
    displayType: (el:string) => el
  },
  "createdAt" : {
    displayName: "Member since",
    displayType: (el:string) => <Moment format={"MMM [']YY"}>{el}</Moment>
  },
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <>
      <Row className="mb-5">
        <Col>
          <h4>Profile</h4>
          <hr />
          {
            user && Object.keys(user).filter((el: string) => ['firstName','lastName', 'createdAt'].includes(el)).map((key: string) =>
              <Row key={key} className="d-flex justify-content-start w-100">
                <Col className="text-start" sm={4}><b>{profileToDisplayMap?.[key]['displayName']}:</b></Col>
                <Col>{profileToDisplayMap?.[key]['displayType'](user[key])}</Col>
              </Row>
            )
          }
        </Col>
      </Row>
    </>
  );
};

export default Profile