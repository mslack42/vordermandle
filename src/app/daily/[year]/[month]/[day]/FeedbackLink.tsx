type FeedbackProps = {
  domain: string;
};
export function FeedbackLink(props: FeedbackProps) {
  return <p><a href={process.env.FEEDBACK_URL_ROOT + props.domain}>Any feedback?</a></p>;
}
