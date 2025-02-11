package service

import (
	"database/sql"
	"errors"
	"html"
	"math"
	"strings"

	"forum/server/data"
	"forum/server/shareddata"
)

type CommentService struct {
	CommentData data.CommentData
	UserData    data.UserData
}

const standardCommentLength = 300

func (s *CommentService) AddComment(comment shareddata.Comment) error {
	// add the userId to the comment
	_, userId := GetUser(s.CommentData.DB, comment.UserUID)
	comment.UserId = userId

	// check if the post exist using the CheckPostExist
	if !s.CommentData.CheckPostExist(comment.PostId) {
		return errors.New(shareddata.PostErrors.PostNotExist)
	}

	// Trim the space from the comment content
	comment.Content = strings.TrimSpace(comment.Content)

	// Fix html
	comment.Content = html.EscapeString(comment.Content)

	// Add the comment Using InsertComment
	err := s.CommentData.InsertComment(comment)

	return err
}

func (s *CommentService) GetComments(postId, page, userId int) ([]shareddata.ShowComment, error) {
	// Validate page number
	if page < 0 {
		return nil, errors.New(shareddata.CommentErrors.InvalidPage)
	}
	// Get comments
	cmts, err := s.CommentData.GetCommentsFrom(page, postId, userId)
	return cmts, err
}

func (s *CommentService) GetCommentMetaData(postId int) (shareddata.CommentMetaData, error) {
	// Get Comments Count
	commentsCount, err := s.CommentData.GetCommentsCount(postId)
	if err != nil {
		return shareddata.CommentMetaData{}, err
	}

	// Get Comments Pages
	commentsPages := int(math.Ceil(float64(float64(commentsCount) / float64(data.CommentsPerPage))))

	return shareddata.CommentMetaData{
		CommentsCount: commentsCount,
		CommentsPages: commentsPages,
		StandardCount: data.CommentsPerPage,
	}, nil
}

func (s *CommentService) CheckUserExist(userUID string) bool {
	// use GetUser to check if the user exist (id == 0 means user doesn't exist)
	_, userId := GetUser(s.CommentData.DB, userUID)
	return userId != 0
}

func (s *CommentService) ValidateInput(comment shareddata.Comment) error {
	// Trim the space from the comment content
	comment.Content = strings.TrimSpace(comment.Content)
	comment.Content = html.EscapeString(comment.Content)

	// Validate data
	if comment.PostId == 0 || len(comment.Content) == 0 {
		return errors.New("post_id and comment content are required")
	}
	if len(comment.Content) > standardCommentLength {
		return errors.New("comment content exceeds maximum allowed length")
	}

	return nil
}

// Helpers
func GetUser(db *sql.DB, uuid string) (string, int) {
	var username string
	var id int

	err := db.QueryRow("SELECT username, id FROM user_profile WHERE uid = ?", uuid).Scan(&username, &id)
	if err != nil {
		return "", 0
	}

	return username, id
}
