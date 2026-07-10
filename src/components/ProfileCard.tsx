interface Props {
  onPhotoClick: () => void;
}

export function ProfileCard({ onPhotoClick }: Props) {
  return (
    <section className="profile-card">
      <div className="profile-info">
        <h2 className="profile-name">Boondirek Kanjanapongporn</h2>
        <dl className="profile-details">
          <div className="profile-detail">
            <dt>Age</dt>
            <dd>23</dd>
          </div>
          <div className="profile-detail">
            <dt>Based in</dt>
            <dd>Glasgow, United Kingdom</dd>
          </div>
        </dl>
      </div>
      <button
        type="button"
        className="profile-photo-button"
        onClick={onPhotoClick}
        aria-label="View larger profile picture"
      >
        <img
          src="/images/profile.jpg"
          alt="Boondirek Kanjanapongporn"
          className="profile-photo"
        />
      </button>
    </section>
  );
}
