import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteAlertsProps {
  deletingCommentId: string | null;
  deletingPost: boolean;
  onDeleteComment: (commentId: string) => void;
  onDeletePost: () => void;
  onCancelDeleteComment: () => void;
  onCancelDeletePost: () => void;
}

export function DeleteAlerts({
  deletingCommentId,
  deletingPost,
  onDeleteComment,
  onDeletePost,
  onCancelDeleteComment,
  onCancelDeletePost,
}: DeleteAlertsProps) {
  return (
    <>
      {/* Delete Comment AlertDialog */}
      <AlertDialog
        open={deletingCommentId !== null}
        onOpenChange={(open) => !open && onCancelDeleteComment()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>댓글 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 댓글을 삭제하시겠습니까? 삭제된 댓글은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancelDeleteComment}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDeleteComment(deletingCommentId as string)}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Post AlertDialog */}
      <AlertDialog
        open={deletingPost}
        onOpenChange={(open) => !open && onCancelDeletePost()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>게시글 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 게시글을 삭제하시겠습니까? 삭제된 게시글은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancelDeletePost}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction onClick={onDeletePost}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
