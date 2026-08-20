  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);
      // यहाँ हमने कॉलम के नाम आपके डेटाबेस के अनुसार सही कर दिए हैं
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('subject', subjectName)       // आपके डेटाबेस में 'subject' नाम है
        .eq('chapter_name', chapterName)  // यह सही लग रहा है
        .eq('file_type', 'Small Notebook')
        .single();

      if (error) {
        console.log("Supabase Error:", error.message);
      } else {
        console.log("Supabase Data:", data);
        setNote(data);
      }
      setLoading(false);
    }
    fetchNotes();
  }, [chapterId, chapterName, subjectName]);
