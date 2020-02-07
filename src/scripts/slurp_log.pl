#!/usr/bin/env perl
#===============================================================================
#
#         FILE: slurp_log.pl
#
#        USAGE: ./slurp_log.pl
#
#  DESCRIPTION:
#
#      OPTIONS: ---
# REQUIREMENTS: ---
#         BUGS: ---
#        NOTES: ---
#       AUTHOR: YOUR NAME (),
# ORGANIZATION:
#      VERSION: 1.0
#      CREATED: 02/06/2020 12:29:11
#     REVISION: ---
#===============================================================================

# {"id":"df1bcebb-d2eb-4765-96c4-ea6ee91d713c","name":"last year today","created":{"$$date":1581044273190},"journalDate":{"$$date":1549440000000},"_id":"pUqixqyjkXhWzHhf"}
use warnings;
use strict;
use utf8;


use File::Slurp qw(read_file write_file append_file);
use DateTime::Format::Flexible;
use Data::Random;


if (scalar @ARGV == 0) {
  print "Needs a file to convert.\n";
}

my $file_name = $ARGV[0];

my $file_name_db = $file_name . ".db";
my @file_content = read_file($file_name);

my $current_month;
my $date = DateTime::Format::Flexible->parse_datetime('1 January 2010');
my $content = "";

foreach my $line (@file_content) {

    if ($line =~ /^\# (.*)/) {
          my $line_match = $1;
          if ($line_match =~ /\d/) {
              # create object and append to file
              my $id = Data::Random::rand_chars(set => 'alphanumeric', min => 16, max => 16);
              my $short_content = $content;
              $short_content =~ s/^\s+//; # trim whitespace
              $short_content = substr($short_content, 0, 20);
              $short_content =~ s/\s+$//; # trim trailing ;
              my $ep = $date->epoch();

              my $journal_object = "{\"id\":\"$id\",\"name\":\"$short_content\",\"note\": \"$content\", \"created\":{\"\$\$date\":$ep},\"journalDate\":{\"\$\$date\":$ep},\"_id\":\"$id\"}\n";
              append_file($file_name_db, $journal_object);
              # reset
              $content = "";
              $current_month = $line_match;
          }
        }
	elsif ($line =~ /^\#\# \/(\d*)/) {
        my $line_match = $1;
        my $current_day = "$line_match $current_month";
        $date = DateTime::Format::Flexible->parse_datetime($current_day);
        }
        else {
        $line =~ tr/"/'/;
        chomp($line);
        $content = $content . $line . "\\n";
        }
      }
