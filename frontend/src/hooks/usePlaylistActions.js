export const usePlaylistActions = (addToPlaylist, submissionId) => {
  const handlePlaylistAction = async (playlistType) => {
    if (!submissionId) return;
    
    try {
      await addToPlaylist(submissionId, playlistType);
      // TODO: Ajouter un message de succès
      return { success: true };
    } catch (err) {
      console.error(err);
      // TODO: Ajouter un message d'erreur
      return { success: false, error: err };
    }
  };

  return { handlePlaylistAction };
};
