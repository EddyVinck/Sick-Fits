import ResetPasswordForm from "../components/ResetPassword";

const ResetPassword = props => (
  <div>
    <ResetPasswordForm resetToken={props.query.resetToken} />
  </div>
);

export default ResetPassword;
